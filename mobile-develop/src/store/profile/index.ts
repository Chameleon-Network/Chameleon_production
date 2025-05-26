import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';
import {homeSlice} from '../home';
import {camelCaseKeys} from '@src/utils';

const initialState = {
  isFetching: true,
  isFetched: false,
  data: {},
};

export const profileSlice = createSlice({
  name: 'profile', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    fetching: (state, action) => {
      return {
        ...state,
        isFetching: true,
      };
    },

    // All the reducers go here
    fetched: (state, action) => {
      // This is the reducer function for the deposit action
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        data: camelCaseKeys(action.payload),
      };
    },
    fetchFailed: state => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
      };
    },
  },
});

export const fetchedProfile = (payload: any) => {
  StoreService?.current?.dispatch(profileSlice.actions.fetched(payload));
  return payload;
};
