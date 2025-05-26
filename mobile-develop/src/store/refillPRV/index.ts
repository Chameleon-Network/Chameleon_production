import {createSlice} from '@reduxjs/toolkit';
import {ACCOUNT_CONSTANT, PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import {StoreService} from '..';
import {PRV_MIN_NEEDED} from './constant';

const initialState = {
  isVisible: false,
  feeTx: ACCOUNT_CONSTANT.MAX_FEE_PER_TX || 0,
  prvId: PRVIDSTR,
  minPRVNeeded: PRV_MIN_NEEDED,
};

export const refillPRVSplice = createSlice({
  name: 'refillPRV', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setModalVisible: (state, action) => {
      const isVisible = action.payload;
      return {
        ...state,
        isVisible: isVisible,
      };
    },
  },
});

export const setRefillPRVModalVisible = (isVisible: boolean) => {
  StoreService?.current?.dispatch(
    refillPRVSplice.actions.setModalVisible(isVisible),
  );
  return isVisible;
};
