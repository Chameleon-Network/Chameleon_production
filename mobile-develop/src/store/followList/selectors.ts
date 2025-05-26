import {createSelector} from 'reselect';
import orderBy from 'lodash/orderBy';
import {defaultAccountSelector} from '../account/selectors';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import { RootState } from '../getStore';

export const followStateSelector = (state: RootState) => state.followWallet


export const followTokensWalletSelector = createSelector(
  followStateSelector,
  defaultAccountSelector,
  (followList, {OTAKey}) => {
    const tokens = orderBy(
      followList?.data[OTAKey] || [],
      [c => c.id === PRVIDSTR, c => Number(c.amount || '0')],
      ['desc', 'desc'],
    );
    return tokens;
  },
);

export const followTokenItemSelector = createSelector(
  followTokensWalletSelector,
  tokens => tokenId => {
    return tokens.find(item => item.id === tokenId);
  },
);

export const isFetchingSelector = createSelector(
  followStateSelector,
  followState => followState?.isFetching,
);

export default {
  followTokensWalletSelector,
};
