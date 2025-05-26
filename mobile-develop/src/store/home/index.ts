import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

const initialState = {
  isFetching: false,
  isFetched: false,
  configs: {
    categories: [],
    headerTitle: null,
  },
  defaultConfigs: null,
  appVersion: {
    outdatedVersion: false,
    link: '',
  },
};

export const homeSlice = createSlice({
  name: 'home', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    syncAppVersion: (state, action) => {
      // This is the reducer function for the deposit action
      const {configs, appVersion} = action.payload;
      return {
        ...state,
        configs: configs || state.configs,
        defaultConfigs: configs || state.defaultConfigs,
        appVersion: appVersion || state.appVersion,
      };
    },
  },
});

export const syncAppVersion = (appVersion: {}) => {
  StoreService?.current?.dispatch(homeSlice.actions.syncAppVersion(appVersion));
  return appVersion;
};
