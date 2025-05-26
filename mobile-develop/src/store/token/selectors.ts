import {PRV_ID} from '@src/constants/common';
import uniq from 'lodash/uniq';
import {createSelector} from 'reselect';
import { RootState } from '../getStore';
import PToken from '@src/models/pToken';

export const followed = (state: RootState) => state?.token?.followed || [];
export const isGettingBalance = (state: RootState) => state?.token?.isGettingBalance || [];
export const pTokens = (state: RootState) => state?.token?.pTokens || [];
export const internalTokens = (state: RootState) => state?.token?.internalTokens || [];
export const tokensFollowedSelector = createSelector(
  followed,
  tokens => tokens,
);
export const pTokensSelector = createSelector(
  state => state?.token?.pTokens,
  (pTokens: PToken[]) => {
    return pTokens.map(token => ({...token, tokenID: token?.tokenId})) || [];
  },
);

export const pTokenIdsSelector = createSelector(
  state => state?.token?.pTokens,
  (pTokens: PToken[]) => pTokens.map(token => token.tokenId) || [],
);

export const internalTokensSelector = createSelector(
  state => state?.token?.internalTokens,
  internalTokens =>
    internalTokens.map((token: PToken) => ({...token, tokenID: token?.id})) || [],
);

export const historyTokenSelector = createSelector(
  state => state?.token?.history,
  history => history,
);

export const isTokenFollowedSelector = createSelector(
  tokensFollowedSelector,
  (tokens: PToken[]) => (tokenId: string) => tokens.find(token => token?.id === tokenId),
);

export const toggleUnVerifiedTokensSelector = createSelector(
  state => state?.token?.toggleUnVerified,
  toggleUnVerified => toggleUnVerified,
);

export const receiveHistorySelector = createSelector(
  state => state?.token?.receiveHistory,
  historyTokenSelector,
  (receiveHistory, history) => {
    const {
      oversize,
      refreshing: refreshingReceiveHistory,
      isFetched: isFetchedReceiveHistory,
      isFetching: isFetchingReceiveHistory,
      notEnoughData: notEnoughDataReceiveHistory,
    } = receiveHistory;
    const {
      histories,
      isFetched,
      isFetching,
      refreshing: refreshingHistory,
    } = history;
    const refreshing = refreshingHistory || refreshingReceiveHistory;
    const notEnoughData =
      (histories?.length < 10 || notEnoughDataReceiveHistory) &&
      !isFetchingReceiveHistory &&
      isFetchedReceiveHistory &&
      !oversize;
    const showEmpty =
      histories?.length === 0 &&
      isFetched &&
      !isFetching &&
      !notEnoughData &&
      !oversize;
    const isLoadmore =
      !notEnoughData &&
      !!receiveHistory?.isFetching &&
      !receiveHistory?.refreshing &&
      !oversize;
    return {
      ...receiveHistory,
      isLoadmore,
      refreshing,
      notEnoughData,
      showEmpty,
    };
  },
);

export const defaultPTokensIDsSelector = createSelector(
  pTokensSelector,
  pTokens =>
    pTokens.filter(token => token.default).map(token => token?.tokenId),
);
// memoize(() => {
//   return pTokens.filter((token) => token.default).map((token) => token?.tokenId);
// }),

export const allTokensIDsSelector = createSelector(
  pTokensSelector,
  internalTokensSelector,
  (pTokens, internalTokens) => {
    let result =
      uniq(
        [{tokenID: PRV_ID}, ...pTokens, ...internalTokens]
          .filter(token => !!token?.tokenID)
          .map(token => token?.tokenID),
      ) || [];
    return result;
  },
);
