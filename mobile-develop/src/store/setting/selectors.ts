import {createSelector} from 'reselect';
import {RootState} from '../getStore';

export const settingSelector = (state: RootState) => state.setting;

export const decimalDigitsSelector = createSelector(
  settingSelector,
  setting => setting?.decimalDigits,
);

export const currencySelector = createSelector(
  settingSelector,
  () => true, // setting?.isToggleUSD,
);

export const hideWalletBalanceSelector = createSelector(
  settingSelector,
  setting => setting?.showWalletBalance,
);

export const isToggleBackupAllKeysSelector = createSelector(
  settingSelector,
  setting => setting.toggleBackupAllKeys,
);

export const isUsePRVToPayFeeSelector = createSelector(
  settingSelector,
  // ({ usePRVToPayFee }) => usePRVToPayFee,
  () => true,
);

export const marketTabSelector = createSelector(
  settingSelector,
  setting => setting.marketTab,
);
