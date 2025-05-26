import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '..';

const initialState = {
  isFetchingListUnifiedToken: false,
  listUnifiedToken: [],
};

export const convertToUnifiedTokenSlice = createSlice({
  name: 'convertToUnifiedToken', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setListUnifiedToken: (state, action) => {
      return {
        ...state,
        isFetchingListUnifiedToken: false,
        listUnifiedToken: action.payload,
      };
    },
    fetchingListUnifiedToken: (state) => {
      return {
        ...state,
        isFetchingListUnifiedToken: true,
      };
    },
  },
});

export const fetchingListUnifiedToken = () => {
  StoreService?.current?.dispatch(convertToUnifiedTokenSlice.actions.fetchingListUnifiedToken());
};

export const setListUnifiedToken = (listUnifiedToken: any) => {
  StoreService?.current?.dispatch(convertToUnifiedTokenSlice.actions.setListUnifiedToken(listUnifiedToken));
};
