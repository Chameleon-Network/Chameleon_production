import {createSelector} from 'reselect';

import BigNumber from 'bignumber.js';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import {selectedPrivacy} from '../selectedPrivacy/selectors';
import {MAX_FEE_PER_TX, MAX_NO_INPUT_DEFRAGMENT} from './constants';
import {defaultAccountSelector} from '../account/selectors';
import { RootState } from '../getStore';

export const streamlineSelector = (state: RootState) => state.streamline

export const streamlineStorageSelector = createSelector(
  streamlineSelector,
  streamline => streamline?.storage,
);

export const streamlineUTXOSSelector = createSelector(
  streamlineSelector,
  streamline => streamline?.UTXOS,
);

export const streamlineConsolidateSelector = createSelector(
  defaultAccountSelector,
  streamlineUTXOSSelector,
  streamlineSelector,
  (account, UTXOS, {isFetchingUTXOS}) => {
    const address = account.PaymentAddress;
    const UTXOSFiltered = uniqBy(
      UTXOS.filter(item => item?.address === address) || [],
      'tokenID',
    );
    const hasExceededMaxInputPRV = UTXOSFiltered.some(
      ({unspentCoins}) => unspentCoins.length > MAX_NO_INPUT_DEFRAGMENT,
    );
    return {
      hasExceededMaxInputPRV,
      UTXOSFiltered,
      isLoading: isEmpty(UTXOSFiltered),
      isFetching: isFetchingUTXOS,
    };
  },
);

export const streamlineDataSelector = createSelector(
  selectedPrivacy,
  streamlineSelector,
  streamlineConsolidateSelector,
  ({tokenId, id}, streamline, {UTXOSFiltered}) => {
    const tokenID = tokenId || id;
    const {consolidated} = streamline;

    const currToken = UTXOSFiltered.find(item => item.tokenID === tokenID);

    let noUTXOS = 0;
    let balance = 0;
    if (currToken) {
      noUTXOS = (currToken.unspentCoins || []).length;
      balance = (currToken.unspentCoins || [])
        .reduce((prev, coin) => {
          return prev.plus(coin?.Value || 0);
        }, new BigNumber(0))
        .toString();
    }
    const times = Math.ceil(noUTXOS / MAX_NO_INPUT_DEFRAGMENT);
    const totalFee = MAX_FEE_PER_TX * times;
    return {
      totalFee,
      times,
      consolidated,
      noUTXOS,
      balance,
    };
  },
);
