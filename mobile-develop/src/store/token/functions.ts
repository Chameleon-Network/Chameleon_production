import {PrivacyVersion, Validator} from 'incognito-chain-web-js/build/wallet';
import {
  defaultAccountSelector,
  defaultAccountWalletSelector,
} from '../account/selectors';
import getStore from '../getStore';
import {orderBy, uniq, uniqBy} from 'lodash';
import {getTokenList, getTokensInfo} from '@src/services/api/token';
import {
  addPToken,
  setGettingBalance,
  setInternalTokenList,
  setPTokenList,
  setToken,
} from '.';
import {walletSelector} from '../wallet/selectors';
import AccountService from '@src/services/wallet/accountService';
import {setTokenBalance, updateTokenList} from '../followList';
import {batch} from 'react-redux';
import tokenService from '@src/services/wallet/tokenService';
import {EXPIRED_TIME} from '@src/services/cache';
import {followTokensWalletSelector} from '../followList/selectors';
import {actionToggleModal} from '../modal/functions';

let LAST_TIME_GET_TOKEN = null;
let IS_LOADING_PTOKEN = false;
const TIME_EXPIRED_LOAD_PTOKEN = 60 * 10000;

/**
 * Replace with new list
 */
export const setListPToken = tokens => {
  if (tokens && tokens.constructor !== Array) {
    throw new TypeError('Tokens must be an array');
  }

  return setPTokenList(tokens);
};

export const setListInternalToken = tokens => {
  if (tokens && tokens.constructor !== Array) {
    throw new TypeError('Tokens must be an array');
  }

  return setInternalTokenList(tokens);
};

export const getBalanceStart = tokenSymbol => setGettingBalance(tokenSymbol);

export const getBalanceFinish = tokenSymbol => setGettingBalance(tokenSymbol);

export const getBalance = async tokenId => {
  new Validator('getTokenBalance-tokenId', tokenId).required().string();
  const state = getStore().getState();
  const wallet = walletSelector(state);
  const account = defaultAccountSelector(state);
  let balance = 0;
  try {
    await setGettingBalance(tokenId);
    balance = await AccountService.getBalance({
      account,
      wallet,
      tokenID: tokenId,
      version: PrivacyVersion.ver2,
    });
    const token = {
      id: tokenId,
      amount: balance,
      loading: false,
    };
    batch(() => {
      setToken(token);
      setTokenBalance({token, OTAKey: account.OTAKey});
    });
  } catch (e) {
    setToken({
      id: tokenId,
      amount: 0,
    });
  }
  return balance ?? 0;
};

export const getPTokenList = async ({
  expiredTime = TIME_EXPIRED_LOAD_PTOKEN,
} = {}) => {
  const now = new Date().getTime();
  const inValidTime =
    LAST_TIME_GET_TOKEN !== null &&
    now - LAST_TIME_GET_TOKEN <= TIME_EXPIRED_LOAD_PTOKEN;
  if (inValidTime || IS_LOADING_PTOKEN) {
    return;
  }
  try {
    IS_LOADING_PTOKEN = true;
    LAST_TIME_GET_TOKEN = now;
    const state = getStore().getState();
    const accountWallet = defaultAccountWalletSelector(state);
    const keyInfo =
      (await accountWallet.getKeyInfo({version: PrivacyVersion.ver2})) || {};
    const coinsIndex = Object.keys(keyInfo.coinindex || {}) || [];
    const followTokens = await accountWallet.getListFollowingTokens();
    const advanceTokens = uniq([...coinsIndex, ...followTokens]);
    const [tokensAdvance, pTokens] = await Promise.all([
      await getTokensInfo(advanceTokens),
      await getTokenList({expiredTime}),
    ]);

    const tokens = orderBy(
      uniqBy([...(tokensAdvance || []), ...pTokens], 'tokenId') || [],
      ['isPUnifiedToken', 'verified'],
      ['desc', 'desc'],
    );
    IS_LOADING_PTOKEN = false;
    await setPTokenList(tokens);
    return tokens;
  } catch (e) {
    LAST_TIME_GET_TOKEN = null;
    IS_LOADING_PTOKEN = false;
    throw e;
  }
};

export const getPTokenListNoCache = async ({
  expiredTime = TIME_EXPIRED_LOAD_PTOKEN,
} = {}) => {
  const now = new Date().getTime();
  try {
    IS_LOADING_PTOKEN = true;
    LAST_TIME_GET_TOKEN = now;
    const state = getStore().getState();
    const accountWallet = defaultAccountWalletSelector(state);
    const keyInfo =
      (await accountWallet.getKeyInfo({version: PrivacyVersion.ver2})) || {};
    const coinsIndex = Object.keys(keyInfo.coinindex || {}) || [];
    const followTokens = await accountWallet.getListFollowingTokens();
    const advanceTokens = uniq([...coinsIndex, ...followTokens]);
    const [tokensAdvance, pTokens] = await Promise.all([
      await getTokensInfo(advanceTokens),
      await getTokenList({expiredTime}),
    ]);

    const tokens = orderBy(
      uniqBy([...(tokensAdvance || []), ...pTokens], 'tokenId') || [],
      ['isPUnifiedToken', 'verified'],
      ['desc', 'desc'],
    );
    IS_LOADING_PTOKEN = false;
    await setListPToken(tokens);
    return tokens;
  } catch (e) {
    LAST_TIME_GET_TOKEN = null;
    IS_LOADING_PTOKEN = false;
    throw e;
  }
};

export const getInternalTokenList = async ({
  expiredTime = EXPIRED_TIME,
} = {}) => {
  try {
    const tokens = (await tokenService.getPrivacyTokens({expiredTime})) || [];
    setListInternalToken(tokens);
    return tokens;
  } catch (e) {
    throw e;
  }
};

// export const actionAddFollowTokenFetching = (payload) => ({
//   type: type.ADD_FOLLOW_TOKEN_FETCHING,
//   payload,
// });

// export const actionAddFollowTokenFail = (payload) => ({
//   type: type.ADD_FOLLOW_TOKEN_FAIL,
//   payload,
// });

// export const actionAddFollowTokenSuccess = (payload) => ({
//   type: type.ADD_FOLLOW_TOKEN_SUCCESS,
//   payload,
// });

export const actionAddFollowToken = async tokenID => {
  try {
    const state = getStore().getState();
    const followTokens = followTokensWalletSelector(state) || [];

    // Check if token already exists in the list followed
    const tokenFollowed = followTokens.some(token => token.id === tokenID);
    if (tokenFollowed) {
      return;
    }

    const newFollowTokens = followTokens.concat([
      {
        id: tokenID,
        amount: 0,
        loading: false,
      },
    ]);
    const account = defaultAccountSelector(state);
    const wallet = walletSelector(state);
    setTimeout(() => {
      const OTAKey = account.OTAKey;
      updateTokenList({
        newTokens: newFollowTokens,
        OTAKey,
      });
    }, 200);
    AccountService.addFollowingTokens([{tokenID}], account, wallet);
    // dispatch(setWallet(wallet));
  } catch (error) {
    // addFollowTokenFail(tokenID)
    throw error;
  }
};

export const actionRemoveFollowToken = async (tokenId: string) => {
  const state = getStore().getState();
  if (!tokenId) {
    return;
  }
  try {
    const account = defaultAccountSelector(state);
    const OTAKey = account.OTAKey;
    const wallet = walletSelector(state);

    setTimeout(() => {
      const followTokens = followTokensWalletSelector(state) || [];
      const newFollowTokens = followTokens.filter(({id}) => id !== tokenId);
      updateTokenList({
        newTokens: newFollowTokens,
        OTAKey,
      });
    }, 200);

    AccountService.removeFollowingToken(tokenId, account, wallet);
    // dispatch(setWallet(wallet));
  } catch (error) {
    // TODO
    // actionAddFollowTokenFail(tokenId)
    throw error;
  }
};

export const actionFaucetPRV = async data => {
  try {
    actionToggleModal({
      shouldCloseModalWhenTapOverlay: true,
      visible: true,
      data,
    });
  } catch (error) {
    throw error;
  }
};
