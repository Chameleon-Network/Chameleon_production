import accountService from '@services/wallet/accountService';
import {COINS, CONSTANT_COMMONS} from '@src/constants';
import PToken from '@src/models/pToken';
import {ExHandler} from '@src/services/exception';
import {
  ACCOUNT_CONSTANT,
  constants,
  PrivacyVersion,
} from 'incognito-chain-web-js/build/wallet';
import {chunk, get} from 'lodash';
import {
  ConvertStatus,
  PTokenConvert,
  TokenConvert,
  TRANSACTION_CONVERT_STATUS,
} from './models';
import {
  listTokenConvertSelector,
  listUnifiedTokenSelectedSelector,
  listUnifiedTokenSelector,
} from './selectors';
import {MINIMUM_PRV_UTXO_TO_CREATE_TRANSACTION} from './utils';
import {getStore} from '../types';
import {defaultAccountSelector} from '../account/selectors';
import {walletSelector} from '../wallet/selectors';
import {pTokensSelector} from '../token/selectors';
import {fetchingListUnifiedToken, setListUnifiedToken} from '.';
import {getDefaultAccountWalletSelector} from '../shared/selectors';
import {actionAddFollowToken} from '../token/functions';
import {MAX_FEE_PER_TX} from '../streamline/constants';

const getPTokenBalance = async (tokenID: string) => {
  let state = getStore().getState();
  const account = defaultAccountSelector(state);
  const wallet = walletSelector(state);
  const balance = await accountService.getBalance({
    account,
    wallet,
    tokenID,
    version: PrivacyVersion.ver2,
  });
  return balance;
};

const setListTokenConvert = async () => {
  let state = getStore().getState();

  // get list unified token from allTokens
  let allTokens = pTokensSelector(state);
  let unifiedTokens: PToken[] = allTokens?.filter(
    (token: PToken) =>
      token.currencyType ===
      CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.UNIFIED_TOKEN,
  );
  await fetchingListUnifiedToken();
  let newUnifiedTokens: TokenConvert[] = [];
  for (var i = 0; i < unifiedTokens.length; i++) {
    const listPTokenConvert = unifiedTokens[i].listUnifiedToken;
    let unifiedTokenBalance: number = 0;
    let newListPTokenConvert: PTokenConvert[] = [];
    for (var j = 0; j < listPTokenConvert?.length; j++) {
      // Get pToken balance of unified token
      const pTokenBalance = await getPTokenBalance(
        listPTokenConvert[j]?.tokenId,
      );

      if (pTokenBalance > 0) {
        unifiedTokenBalance = unifiedTokenBalance + pTokenBalance;
        newListPTokenConvert.push({
          ...listPTokenConvert[j],
          balance: pTokenBalance,
          convertStatus: null,
          parentUnifiedTokenId: unifiedTokens[i].tokenId,
          parentUnifiedTokenSymbol: unifiedTokens[i].symbol,
        });
      }
    }
    if (unifiedTokenBalance > 0) {
      newUnifiedTokens.push({
        ...unifiedTokens[i],
        listUnifiedToken: newListPTokenConvert,
        balance: unifiedTokenBalance,
        selected: true,
      });
    }
  }

  await setListUnifiedToken(newUnifiedTokens);
};

const updateConvertStatus = async (
  unifiedTokenId: string,
  pTokenId: string,
  status: ConvertStatus,
) => {
  const state = getStore();
  // get list token user selected
  let listUnifiedToken: TokenConvert[] = listUnifiedTokenSelector(state);
  // find index of unified token by unifiedTokenId;
  const unifiedTokenIndex = listUnifiedToken.findIndex(
    (token: TokenConvert) => token.tokenId === unifiedTokenId,
  );
  // listPToken of unified token
  const listPToken = listUnifiedToken[unifiedTokenIndex]?.listUnifiedToken;
  // find index of pToken by pTokenId
  const pTokenIndex = listPToken.findIndex(
    (token: PTokenConvert) => token.tokenId === pTokenId,
  );
  // make newListTokenConvert array
  let newListUnifiedToken = [...listUnifiedToken];
  newListUnifiedToken[unifiedTokenIndex].listUnifiedToken[
    pTokenIndex
  ].convertStatus = status;
  setListUnifiedToken(newListUnifiedToken);
};

const createTransactionConvert = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = defaultAccountSelector(state);
    const wallet = walletSelector(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    const listPTokenConvert: PTokenConvert[] = listTokenConvertSelector(state);
    if (!listPTokenConvert?.length) return;
    for (var i = 0; i < listPTokenConvert.length; i++) {
      const pTokenData: PTokenConvert = listPTokenConvert[i];
      let unspentCoinsOfPToken: any[] =
        (await accountWallet.getUnspentCoinsExcludeSpendingCoins({
          tokenID: pTokenData?.tokenId,
          version: PrivacyVersion.ver2,
        })) || [];
      // sort unspentCoins of pToken by price value in ascending order:
      unspentCoinsOfPToken = unspentCoinsOfPToken.sort(
        (a: {Value: any}, b: {Value: any}) =>
          parseFloat(b.Value) - parseFloat(a.Value),
      );
      // calculate number of transaction to convert 1 pToken to unifiedToken
      const numberOfTransactionToConvert =
        (unspentCoinsOfPToken?.length -
          (unspentCoinsOfPToken?.length % constants.MAX_INPUT_PER_TX)) /
          constants.MAX_INPUT_PER_TX +
        1;
      // convert unspentCoins from One-Dimensional array to Two-Dimensional array
      let unspentCoinsOfPTokenToConvert: any = chunk(
        unspentCoinsOfPToken,
        constants.MAX_INPUT_PER_TX,
      );

      // update convert status for pToken to Processing
      await updateConvertStatus(
        pTokenData?.parentUnifiedTokenId,
        pTokenData?.tokenId,
        'PROCESSING',
      );

      const sleep = milliseconds => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
      };

      // create burning request
      let transactionStatusArray: any[] = [];
      for (var j = 0; j < unspentCoinsOfPTokenToConvert?.length; j++) {
        let convertAmount = unspentCoinsOfPTokenToConvert[j]
          .map(item => parseFloat(item.Value))
          .reduce((prevValue, nextValue) => prevValue + nextValue);
        const data: any = {
          wallet,
          account,
          fee: MAX_FEE_PER_TX,
          tokenId: pTokenData?.tokenId,
          prvPayments: [],
          info: '',
          txHashHandler: null,
          pUnifiedTokenID: pTokenData?.parentUnifiedTokenId,
          convertAmount: convertAmount,
          networkId: pTokenData?.networkId,
        };

        let numberOfTimeToWait = 0;
        while (true) {
          const unspentCoinsOfPRV =
            (await accountWallet.getUnspentCoinsExcludeSpendingCoins({
              tokenID: COINS.PRV_ID,
              version: PrivacyVersion.ver2,
            })) || [];
          let prvBalance = 0;
          if (unspentCoinsOfPRV?.length > 0) {
            prvBalance = unspentCoinsOfPRV
              ?.map(item => parseFloat(item.Value))
              ?.reduce((prevValue, nextValue) => prevValue + nextValue);
          }

          if (prvBalance >= MAX_FEE_PER_TX) {
            try {
              const result =
                await accountService.createBurningRequestForConvertUnifiedToken(
                  data,
                );
              console.log(
                'createBurningRequestForConvertUnifiedTokenResult:',
                result,
              );
              transactionStatusArray.push(
                TRANSACTION_CONVERT_STATUS.SUCCESSFULLY,
              );
            } catch (error) {
              transactionStatusArray.push(TRANSACTION_CONVERT_STATUS.FAILED);
              console.log('error', error);
            }
            break;
          } else {
            await sleep(20000);
            numberOfTimeToWait = numberOfTimeToWait + 1;
            if (
              numberOfTimeToWait === 6 &&
              transactionStatusArray.length < numberOfTransactionToConvert
            ) {
              transactionStatusArray.push(TRANSACTION_CONVERT_STATUS.FAILED);
              break;
            }
          }
        }
      }
      // Check if all transactions have been processed (when transactionStatusArray.length === numberOfTransactionToConvert => Done)
      if (transactionStatusArray.length === numberOfTransactionToConvert) {
        const transactionSuccessArray = transactionStatusArray.filter(
          status => status === TRANSACTION_CONVERT_STATUS.SUCCESSFULLY,
        );
        if (transactionSuccessArray?.length === numberOfTransactionToConvert) {
          // only update status is Successfully when all transaction successfully
          await updateConvertStatus(
            pTokenData?.parentUnifiedTokenId,
            pTokenData?.tokenId,
            'SUCCESSFULLY',
          );
        } else {
          // if one of transaction failed => update status fail
          await updateConvertStatus(
            pTokenData?.parentUnifiedTokenId,
            pTokenData?.tokenId,
            'FAILED',
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const actionFollowUnifiedTokens = async () => {
  let state = getStore().getState();
  const listUnifiedToken = listUnifiedTokenSelectedSelector(state);
  if (!listUnifiedToken?.length) return;
  for (var i = 0; i < listUnifiedToken?.length; i++) {
    actionAddFollowToken(listUnifiedToken[i].tokenId);
  }
};

const convertToUnifiedToken = async () => {
  let state = getStore().getState();
  const account: any = defaultAccountSelector(state);
  const wallet: any = walletSelector(state);
  try {
    // get PRV balance and unspent coins
    const accountWallet = getDefaultAccountWalletSelector(state);
    const prvBalance = await accountService.getBalance({
      account,
      wallet,
      tokenID: COINS.PRV_ID,
      version: PrivacyVersion.ver2,
    });
    const unspentCoinsOfPRV =
      (await accountWallet.getUnspentCoinsExcludeSpendingCoins({
        tokenID: COINS.PRV_ID,
        version: PrivacyVersion.ver2,
      })) || [];
    console.log({prvBalance, unspentCoinsOfPRV});

    // get list pToken to Convert
    const listPTokenConvert = listTokenConvertSelector(state);

    // validate prv balance and create transaction;
    let minimumPRVBalanceToCreateTransaction =
      MAX_FEE_PER_TX * listPTokenConvert?.length * 2;
    if (minimumPRVBalanceToCreateTransaction < 1000) {
      minimumPRVBalanceToCreateTransaction = 1000;
    }
    if (prvBalance < minimumPRVBalanceToCreateTransaction) {
      throw 'PRV balance not enough to convert';
    }

    // check prv utxo
    let numberPRVUTXOsEnoughBalance: number = 0;
    for (var i = 0; i < unspentCoinsOfPRV?.length; i++) {
      if (unspentCoinsOfPRV[i].Value >= MAX_FEE_PER_TX) {
        numberPRVUTXOsEnoughBalance = numberPRVUTXOsEnoughBalance + 1;
      }
    }

    if (numberPRVUTXOsEnoughBalance >= MINIMUM_PRV_UTXO_TO_CREATE_TRANSACTION) {
      // create transaction
      createTransactionConvert();
    } else {
      // split UTXO of PRV, after split => create convert transaction
      const res = await splitPRVUTXOs(
        MINIMUM_PRV_UTXO_TO_CREATE_TRANSACTION - numberPRVUTXOsEnoughBalance,
      );
      if (res) {
        setTimeout(() => {
          createTransactionConvert();
        }, 30000);
      }
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
    throw error;
  }
};

const splitPRVUTXOs = async (numberUTXO: number) => {
  try {
    let state = getStore().getState();
    const account: any = defaultAccountSelector(state);
    const wallet: any = walletSelector(state);
    let tokenPaymentInfo: any = [];
    for (var i = 0; i < numberUTXO; i++) {
      tokenPaymentInfo.push({
        PaymentAddress: account?.PaymentAddress,
        Amount: MAX_FEE_PER_TX,
        Message: '',
      });
    }
    const res = await accountService.createAndSendNativeToken({
      wallet,
      account,
      fee: MAX_FEE_PER_TX,
      info: '',
      prvPayments: tokenPaymentInfo,
      txType: ACCOUNT_CONSTANT.TX_TYPE.SEND,
      version: PrivacyVersion.ver2,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const updateSelectedTokenToConvert = async (unifiedTokenId: string) => {
  const state = getStore().getState();
  let listUnifiedToken = listUnifiedTokenSelector(state);
  // find index of token selected
  const tokenSelectedIndex = listUnifiedToken.findIndex(
    (token: TokenConvert) => token.tokenId === unifiedTokenId,
  );
  // Make newListUnifiedToken array
  let newListUnifiedToken = [...listUnifiedToken];
  newListUnifiedToken[tokenSelectedIndex].selected =
    !newListUnifiedToken[tokenSelectedIndex].selected;
  dispatch(actions.setListUnifiedToken(newListUnifiedToken));
};

export {
  setListTokenConvert,
  convertToUnifiedToken,
  updateSelectedTokenToConvert,
  actionFollowUnifiedTokens,
};
