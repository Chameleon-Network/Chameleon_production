import {Store} from '@reduxjs/toolkit';

// Use ReturnType to derive RootState from the rootReducer
// This avoids circular imports because we're not importing the actual reducer,
// just defining what the RootState would look like
export interface RootState {
  account: any;
  convertToUnifiedToken: any;
  followWallet: any;
  getStarted: any;
  home: any;
  masterKey: any;
  modal: any;
  news: any;
  notification: any;
  pairlist: any;
  pDexV3: any;
  pin: any;
  profile: any;
  refillPRV: any;
  selectedPrivacy: any;
  setting: any;
  settings: any;
  shield: any;
  streamline: any;
  tabs: any;
  token: any;
  unShield: any;
  wallet: any;
  [key: string]: any; // Allow for dynamic keys
}

// Store instance to be used throughout the app
let _store: Store;

export const getStore = (): Store<RootState> => {
  if (!_store) {
    throw new Error('Please implement setStore before using this function');
  }

  return _store;
};

export const setStore = (store: Store) => {
  _store = store;
}; 