import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

const initialState = {
  data: null
};

export const childSelectedPrivacySlice = createSlice({
  name: 'childSelectedPrivacy', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    set: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    clear: (state) => {
      return {
        ...state,
        data: null,
      };
    },  
  },
});

export const setChildSelectedPrivacy = (payload: any) => {
  StoreService?.current?.dispatch(childSelectedPrivacySlice.actions.set(payload));
};

export const clearChildSelectedPrivacy = () => {
  StoreService?.current?.dispatch(childSelectedPrivacySlice.actions.clear());
};
