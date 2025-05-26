import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

export const MarketTabs = {
  ALL: 'all',
  FAVORITE: 'favorite',
};

const initialState = {
  defaultServerId: 1,
  devices: [],
  server: null,
  decimalDigits: true,
  isToggleUSD: true,
  showWalletBalance: false,
  toggleBackupAllKeys: true,
  usePRVToPayFee: false,
  marketTab: MarketTabs.ALL,
};

export const settingSlice = createSlice({
  name: 'setting', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    toggleMarketTab: state => {
      return {...state, usePRVToPayFee: !state.usePRVToPayFee};
    },
    toggleBackupAllKeys: (state, action) => {
      return {...state, toggleBackupAllKeys: action.payload};
    },
    syncDevices: (state, action) => {
      return {...state, devices: action.payload};
    },
    syncServer: (state, action) => {
      return {...state, server: {...action.payload}};
    },
    toggleDecimalDigits: state => {
      return {...state, decimalDigits: !state.decimalDigits};
    },
    toggleCurrency: state => {
      return {...state, isToggleUSD: !state?.isToggleUSD};
    },
    toggleShowWalletBalance: state => {
      return {...state, showWalletBalance: !state.showWalletBalance};
    },
    updateMarketTab: (state, action) => {
      return {...state, marketTab: action.payload};
    },
  },
});

export const actionToggleUsePRVToPayFee = () => {
  StoreService?.current?.dispatch(settingSlice.actions.toggleMarketTab());
};

export const actionToggleBackupAllKeys = (payload: boolean) => {
  StoreService?.current?.dispatch(
    settingSlice.actions.toggleBackupAllKeys(payload),
  );
};

export const actionFetchedDevices = (payload: any) => {
  StoreService?.current?.dispatch(settingSlice.actions.syncDevices(payload));
};

export const actionFetchedServer = (payload: any) => {
  StoreService?.current?.dispatch(settingSlice.actions.syncServer(payload));
};

export const actionToggleDecimalDigits = () => {
  StoreService?.current?.dispatch(settingSlice.actions.toggleDecimalDigits());
};

export const actionToggleCurrency = () => {
  StoreService?.current?.dispatch(settingSlice.actions.toggleCurrency());
};

export const actionUpdateShowWalletBalance = () => {
  StoreService?.current?.dispatch(
    settingSlice.actions.toggleShowWalletBalance(),
  );
};

export const actionToggleMarketTab = (payload: any) => {
  StoreService?.current?.dispatch(
    settingSlice.actions.updateMarketTab(payload),
  );
};
