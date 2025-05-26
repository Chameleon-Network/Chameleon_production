import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

const initialState = {
  tokenID: null,
};

export const selectedPrivacySlice = createSlice({
  name: 'selectedPrivacy', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setSelectedPrivacy: (state, action) => {
      return {
        ...state,
        tokenID: action.payload,
      };
    },
    clearSelectedPrivacy: state => {
      return {
        ...state,
        tokenID: null,
      };
    },
  },
});

export const setSelectedPrivacy = (tokenID: string) => {
  StoreService?.current?.dispatch(
    selectedPrivacySlice.actions.setSelectedPrivacy(tokenID),
  );
  return tokenID;
};

export const clearSelectedPrivacy = () => {
  StoreService?.current?.dispatch(
    selectedPrivacySlice.actions.clearSelectedPrivacy(),
  );
  return;
};
