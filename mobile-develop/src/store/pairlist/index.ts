import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '..';

const initialState = {
  pairs: {},
};

export const pairlistSlice = createSlice({
  name: 'pairlist', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    syncPairlist: (state, action) => {
      // This is the reducer function for the deposit action
      const {pairlist} = action.payload;
      return {
        ...state,
        pairs: pairlist,
      };
    },
  },
});

export const syncPairlist = (pairlist: {}) => {
  StoreService?.current?.dispatch(pairlistSlice.actions.syncPairlist(pairlist));
  return pairlist;
};
