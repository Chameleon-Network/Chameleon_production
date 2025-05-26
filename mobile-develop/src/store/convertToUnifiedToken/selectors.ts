import { createSelector } from 'reselect';
import { PTokenConvert, TokenConvert } from './models';
import { followTokensWalletSelector } from '../followList/selectors';
import { getPrivacyDataByTokenID } from '../selectedPrivacy/selectors';

export const listUnifiedTokenSelector = createSelector(
  (state: any) => state?.convertToUnifiedToken,
  (data) => data?.listUnifiedToken,
);

export const loadingGetListUnifiedTokenSelector = createSelector(
  (state: any) => state?.convertToUnifiedToken,
  (data) => data?.isFetchingListUnifiedToken,
);

export const listUnifiedTokenSelectedSelector = createSelector(
  listUnifiedTokenSelector,
  (listUnifiedToken) =>
    listUnifiedToken?.filter((token: TokenConvert) => token?.selected),
);

export const listTokenConvertSelector = createSelector(
  listUnifiedTokenSelector,
  (listUnifiedToken) => {
    const listTokenConvert: PTokenConvert[] = [];
    for (var i = 0; i < listUnifiedToken.length; i++) {
      if (listUnifiedToken[i]?.selected) {
        for (var j = 0; j < listUnifiedToken[i].listUnifiedToken.length; j++) {
          listTokenConvert.push(listUnifiedToken[i].listUnifiedToken[j]);
        }
      }
    }
    return listTokenConvert;
  },
);

export const checkConvertSelector = createSelector(
  followTokensWalletSelector,
  getPrivacyDataByTokenID,
  (followList, getPrivacyDataByTokenID) => {
    for (var i = 0; i < followList?.length; i++) {
      let tokenData = getPrivacyDataByTokenID(followList[i]?.id);
      if (
        tokenData?.movedUnifiedToken &&
        parseFloat(followList[i]?.amount) > 0
      ) {
        return true;
      }
    }
    return false;
  },
);
