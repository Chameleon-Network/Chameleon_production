import { createSelector } from 'reselect';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import memoize from 'memoize-one';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import { BIG_COINS, PRIORITY_LIST } from '@src/screens/Dex/constants';
import toLower from 'lodash/toLower';
import {
  ACCOUNT_CONSTANT,
  PRVIDSTR as PRV_ID,
} from 'incognito-chain-web-js/build/wallet';
import BigNumber from 'bignumber.js';
import { defaultAccount } from '../account/selectors';
import {
  internalTokens,
  pTokenIdsSelector,
  pTokens,
  tokensFollowedSelector,
} from '../token/selectors';
import { followTokensWalletSelector } from '../followList/selectors';
import { getPrice } from './utils';
import { minPRVNeededSelector } from '../refillPRV/selector';
import { toHumanAmount, toNumber } from '@src/utils/common';

export const selectedPrivacyTokenID = createSelector(
  state => state?.selectedPrivacy?.tokenID,
  tokenId => tokenId,
);

export const getPrivacyDataByTokenID = createSelector(
  defaultAccount,
  internalTokens,
  pTokens,
  tokensFollowedSelector,
  followTokensWalletSelector,
  (account, internalTokens, pTokens, followed, tokenFollowWallet) =>
    memoize(tokenID => {
      let data = {};
      if (!tokenID) {
        return data;
      }
      try {
        tokenID = toLower(tokenID);
        const internalTokenData =
          internalTokens?.find(
            t => t?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID && t?.id === tokenID,
          ) || {};
        const pTokenData = pTokens?.find(t => t?.tokenId === tokenID);
        const followedTokenData = followed.find(t => t?.id === tokenID) || {};
        const isExistTokenFollowInWallet = tokenFollowWallet.some(
          t => t?.id === tokenID,
        );
        if (
          !internalTokenData &&
          !pTokenData &&
          tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID
        ) {
          console.log(`Can not find coin with id ${tokenID}`);
        }
        const token = new SelectedPrivacy(
          account,
          { ...internalTokenData, ...followedTokenData },
          pTokenData,
          tokenID,
        );

        // convert childToken data to selected privacy token data of list unified token
        let listUnifiedToken = token?.listUnifiedToken;
        let unifiedTokens = [];
        for (let i = 0; i < listUnifiedToken?.length; i++) {
          const childTokenId = listUnifiedToken[i]?.tokenId;
          const childTokenData = listUnifiedToken[i];
          const childTokenSelectedPrivacyData = new SelectedPrivacy(
            account,
            null,
            childTokenData,
            childTokenId,
          );
          unifiedTokens.push(childTokenSelectedPrivacyData);
        }
        token.listUnifiedToken = unifiedTokens || [];

        // convert childToken data to selected privacy token data of list child token
        let listChildTokenOfPRV = token?.listChildToken;
        let newListChildTokenOfPRV = [];
        for (let i = 0; i < listChildTokenOfPRV?.length; i++) {
          const childTokenId = listChildTokenOfPRV[i]?.tokenId;
          const childTokenData = listChildTokenOfPRV[i];
          const childTokenSelectedPrivacyData = new SelectedPrivacy(
            account,
            null,
            childTokenData,
            childTokenId,
          );
          newListChildTokenOfPRV.push(childTokenSelectedPrivacyData);
        }
        token.listChildToken = newListChildTokenOfPRV || [];

        const tokenUSDT = pTokens.find(
          token => token?.tokenId === BIG_COINS.USDT,
        );
        const price = getPrice({ token, tokenUSDT });
        let priority =
          PRIORITY_LIST.indexOf(tokenID) > -1
            ? PRIORITY_LIST.indexOf(tokenID)
            : PRIORITY_LIST.length + 1;
        data = {
          ...token,
          ...price,
          amount: followedTokenData.amount,
          isFollowed: isExistTokenFollowInWallet,
          priority,
        };
      } catch (e) {
        console.log('error', tokenID, e);
      }
      return data;
    }),
);

export const getPrivacyDataBaseOnAccount = createSelector(
  internalTokens,
  pTokens,
  tokensFollowedSelector,
  selectedPrivacyTokenID,
  (_internalTokens, _pTokens, _followed, tokenID) => account => {
    try {
      // 'PRV' is not a token
      const internalTokenData =
        _internalTokens?.find(
          t => t?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID && t?.id === tokenID,
        ) || {};
      const pTokenData = _pTokens?.find(t => t?.tokenId === tokenID);
      const followedTokenData = _followed.find(t => t?.id === tokenID) || {};
      if (
        !internalTokenData &&
        !pTokenData &&
        tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID
      ) {
        console.log(`Can not find coin with id ${tokenID}`);
      }
      return new SelectedPrivacy(
        account,
        { ...internalTokenData, ...followedTokenData },
        pTokenData,
      );
    } catch (e) {
      new ExHandler(e);
    }
  },
);

export const selectedPrivacy = createSelector(
  selectedPrivacyTokenID,
  getPrivacyDataByTokenID,
  (selectedSymbol, getFn) => {
    return getFn(selectedSymbol);
  },
);

export const selectedPrivacyByFollowedSelector = createSelector(
  selectedPrivacy,
  tokensFollowedSelector,
  (selected, followed) =>
    followed.find(token => token?.id === selected?.tokenId),
);

export const findTokenFollowedByIdSelector = createSelector(
  tokensFollowedSelector,
  followed => tokenID => followed.find(token => token?.id === tokenID),
);

export const getAllPrivacyDataSelector = createSelector(
  pTokenIdsSelector,
  getPrivacyDataByTokenID,
  (tokenIdList, getPrivacyDataByTokenIDFunction) =>
    tokenIdList.map(tokenId => getPrivacyDataByTokenIDFunction(tokenId)) || [],
);

export const getPrivacyPRVInfo = createSelector(
  getPrivacyDataByTokenID,
  defaultAccount,
  (getFn, account) => {
    // console.log('Current Account: ', account);

    const prvInfor = getFn(PRV_ID);

    const { priceUsd, decimals, pDecimals, tokenId, symbol, externalSymbol } =
      prvInfor;

    //
    const feePerTx = ACCOUNT_CONSTANT.MAX_FEE_PER_TX || 0;
    const feePerTxToHuman = toHumanAmount(
      new BigNumber(feePerTx),
      pDecimals,
    );
    const feePerTxToHumanStr = feePerTxToHuman.toString();
    const feeAndSymbol = `${feePerTxToHumanStr} ${symbol || externalSymbol} `;
    //
    const prvBalanceOriginal = toNumber(account.value) || 0;
    const prvbalanceToHuman = toHumanAmount(
      new BigNumber(prvBalanceOriginal),
      pDecimals,
    );
    const prvbalanceToHumanStr = prvbalanceToHuman.toString();
    // console.log(' prvBalanceOriginal ', prvBalanceOriginal);
    // console.log(' feePerTx ', feePerTx);

    const isEnoughNetworkFeeDefault = new BigNumber(prvBalanceOriginal).gt(
      new BigNumber(feePerTx),
    );
    // console.log('=>>> isEnoughNetworkFeeDefault ', isEnoughNetworkFeeDefault);
    const isNeedFaucet = new BigNumber(prvBalanceOriginal).isLessThan(
      new BigNumber(feePerTx),
    );
    const isCurrentBalanceGreaterPerTx = new BigNumber(prvBalanceOriginal).gt(
      feePerTx,
    );

    const result = {
      priceUsd,
      decimals,
      tokenId,
      pDecimals,
      symbol,
      externalSymbol,
      PRV_ID,
      feePerTx,
      feePerTxToHuman,
      feePerTxToHumanStr,
      feeAndSymbol,

      prvBalanceOriginal,
      prvbalanceToHuman,
      prvbalanceToHumanStr,
      isEnoughNetworkFeeDefault,

      isCurrentBalanceGreaterPerTx,
      isNeedFaucet,
    };

    // console.log('[getPrivacyPRVInfo] RESULT: ', result);

    return result;
  },
);

export const validatePRVBalanceSelector = createSelector(
  getPrivacyPRVInfo,
  minPRVNeededSelector,
  defaultAccount,
  (prvBalanceInfor, minPRVNeeded, account) =>
    (totalPRVBurn, isPRVBurn = false) => {
      let result = {
        isEnoughtPRVNeededAfterBurn: true,
        isCurrentPRVBalanceExhausted: false,
        isPRVBurn: false,
      };

      try {
        const { prvBalanceOriginal, feePerTx } = prvBalanceInfor;
        const totalPRVBurnBN = new BigNumber(totalPRVBurn || feePerTx); //If totalPRVBurn = 0, get default burn 0.1PRV / Transaction
        const prvBalanceOriginalBN = new BigNumber(prvBalanceOriginal || 0);
        const minPRVNeededBN = new BigNumber(minPRVNeeded || feePerTx);

        // console.log('[validatePRVBalanceSelector]  ', {
        //   prvBalanceOriginal,
        //   totalPRVBurn,
        //   minPRVNeeded
        // });

        // if current PRV Balance < minPRVNeededBN
        // (isCurrentPRVBalanceExhausted = true, otherwise isCurrentPRVBalanceExhausted = false )
        // User can not perform any action
        result.isCurrentPRVBalanceExhausted =
          prvBalanceOriginalBN.lt(minPRVNeededBN);

        // Ingore ReFill PopUp PRV (will change after) => hard code value = TRUE!
        result.isEnoughtPRVNeededAfterBurn = prvBalanceOriginalBN
          .minus(totalPRVBurnBN)
          .isGreaterThanOrEqualTo(minPRVNeededBN);

        // Hard code = true, ignore case Refill PRV!?
        // result.isEnoughtPRVNeededAfterBurn = true;
      } catch (error) {
        console.log('[validatePRVBalanceSelector] error ', error);
      } finally {
        // console.log('[validatePRVBalanceSelector] RESULT  ', result);
      }
      return result;
    },
);
