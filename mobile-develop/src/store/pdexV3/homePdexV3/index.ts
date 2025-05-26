import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '@src/store';

const initialState = {};

export const homePdexV3Slice = createSlice({
  name: 'home', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    fetching: (state) => {
      return {
        ...state,
        isFetching: true,
      };
    },
    fetched: (state) => {
      return {
        ...state,
        isFetching: false,
        isFetched: true,
      };
    },
    fetchFailed: (state) => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
      };
    },
    freeHomePdexV3: () => {
      return initialState;
    },
  },
});

export const fetchingHomePdexV3 = () => {
  StoreService.dispatch(homePdexV3Slice.actions.fetching());
};

export const fetchedHomePdexV3 = () => {
  StoreService.dispatch(homePdexV3Slice.actions.fetched());
};

export const fetchFailedHomePdexV3 = () => {
  StoreService.dispatch(homePdexV3Slice.actions.fetchFailed());
};

export const freeHomePdexV3 = () => {
  StoreService.dispatch(homePdexV3Slice.actions.freeHomePdexV3());
};
