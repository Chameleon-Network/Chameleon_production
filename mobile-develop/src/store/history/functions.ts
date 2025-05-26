import {
  ACCOUNT_CONSTANT,
  Validator,
  PrivacyVersion,
} from 'incognito-chain-web-js/build/wallet';
import {
  selectedPrivacy,
  selectedPrivacy as selectedPrivacySelector,
} from '@src/store/selectedPrivacy/selectors';
import {
  historyDetailSelector,
  historySelector,
  mappingTxPortalSelector,
  mappingTxPTokenSelector,
  mappingTxReceiverSelector,
  mappingTxTransactorSelector,
} from './history';
import {getDefaultAccountWalletSelector} from '../shared/selectors';
import {
  fetchedHistory,
  fetchedTx,
  fetchFailHistory,
  fetchFreeHistory,
  fetchingHistory,
  fetchingTx,
  freeHistoryDetail,
  setSelectedTx,
} from '.';
import getStore from '../getStore';

export const ACTION_FETCHING = '[history] Fetching data';
export const ACTION_FETCHED = '[history] Fetched data';
export const ACTION_FETCH_FAIL = '[history] Fetch fail data';
export const ACTION_FREE = '[history] Free data';
export const ACTION_SET_SELECTED_TX = '[history] Set selected tx';
export const ACTION_FETCHING_TX = '[history] Fetching tx';
export const ACTION_FETCHED_TX = '[history] Fetched tx';
export const ACTION_FREE_HISTORY_DETAIL = '[history] Free history detail';

export const actionSetSelectedTx = payload => setSelectedTx(payload);

export const actionFree = () => fetchFreeHistory();

export const actionFetching = () => fetchingHistory();

export const actionFetched = payload => fetchedHistory(payload);

export const actionFetchFail = () => fetchFailHistory();

export const actionFetch = async ({
  tokenID,
  version = PrivacyVersion.ver2,
} = {}) => {
  try {
    const state = getStore().getState();
    const history = historySelector(state);
    const {isFetching} = history;
    if (isFetching) {
      return;
    }
    const selectedPrivacy = selectedPrivacySelector(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    await actionFetching();
    const _tokenID = tokenID || selectedPrivacy.tokenId;
    new Validator('tokenID', _tokenID).required().string();
    console.log('GET HISTORY with Params: ', {
      tokenID: _tokenID,
      isPToken: selectedPrivacy.isPToken,
      version,
    });
    const data = await accountWallet.getTxsHistory({
      tokenID: _tokenID,
      isPToken: selectedPrivacy.isPToken,
      version,
    });
    await actionFetched(data);
  } catch (error) {
    await actionFetchFail();
    throw error;
  }
};

export const actionFetchingTx = () => fetchingTx();

export const actionFetchedTx = payload => fetchedTx(payload);

export const actionFetchTx = async () => {
  const state = getStore().getState();
  let {tx, fetching} = historyDetailSelector(state);
  if (fetching) {
    return tx;
  }
  try {
    new Validator('tx', tx).required().object();
    await actionFetchingTx()
    if (!tx) {
      return;
    }
    const {txType} = tx;
    const {tokenId: tokenID} = selectedPrivacy(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    new Validator('accountWallet', accountWallet).required().object();
    const version = PrivacyVersion.ver2;

    switch (txType) {
      case ACCOUNT_CONSTANT.TX_TYPE.RECEIVE: {
        tx = mappingTxReceiverSelector(state)(tx);
        break;
      }
      case ACCOUNT_CONSTANT.TX_TYPE.SHIELD:
      case ACCOUNT_CONSTANT.TX_TYPE.UNSHIELD: {
        const txp = await accountWallet.handleGetPTokenHistoryById({
          history: tx,
        });
        if (!txp) {
          return tx;
        }
        tx = mappingTxPTokenSelector(state)(txp);
        break;
      }
      case ACCOUNT_CONSTANT.TX_TYPE.SHIELDPORTAL: {
        const txp = await accountWallet.updateStatusShieldPortalTx(tx, tokenID);
        if (!txp) {
          return tx;
        }
        tx = mappingTxPortalSelector(state)(txp);
        break;
      }
      case ACCOUNT_CONSTANT.TX_TYPE.UNSHIELDPORTAL: {
        const txp = await accountWallet.updateStatusUnShieldPortalTx(tx);
        if (!txp) {
          return tx;
        }
        tx = mappingTxPortalSelector(state)(txp);
        break;
      }
      default: {
        const {txId} = tx;
        const params = {
          txId,
          tokenID,
          version,
        };
        let txt = await accountWallet.getTxHistoryByTxID(params);
        if (!txt) {
          return tx;
        }
        tx = mappingTxTransactorSelector(state)({
          ...tx,
          status: txt?.status || tx?.status,
          statusStr: txt?.statusStr || tx?.statusStr,
        });
        break;
      }
    }
  } catch (error) {
    throw error;
  } finally {
    await actionFetchedTx(tx);
  }
  return tx;
};

export const actionFreeHistory = () => freeHistoryDetail();