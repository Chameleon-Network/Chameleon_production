import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

const initialState = null;

export const walletSlice = createSlice({
  name: 'wallet', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    syncWallet: (state, action) => {
      // This is the reducer function for the deposit action
      const {pairlist} = action.payload;
      return {
        ...state,
        pairs: pairlist,
      };
    },
    removeWallet: () => {
      return initialState;
    },
  },
});

export const setWallet = wallet => {
  StoreService?.current?.dispatch(walletSlice.actions.syncWallet(wallet));
  return wallet;
};

export const removeWallet = () => {
  StoreService?.current?.dispatch(walletSlice.actions.removeWallet());
  return;
};
