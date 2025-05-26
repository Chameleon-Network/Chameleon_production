import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '@src/store';

const initialState = {
  isFetching: true,
  isFetched: false,
  data: [],
};

export const tradeSlice = createSlice({
  name: 'trade', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    fetching: state => {
      return {
        ...state,
        isFetching: true,
      };
    },
    fetched: (state, action) => {
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        data: action.payload,
      };
    },
    fetchFail: state => {
      return {
        ...state,
        isFetching: false,
        isFetched: false,
      };
    },
  },
});

export const fetchingPdexV3Trade = () => {
  StoreService?.current?.dispatch(tradeSlice.actions.fetching());
};

export const fetchedPdexV3Trade = (data: {}) => {
  StoreService?.current?.dispatch(tradeSlice.actions.fetched(data));
  return data;
};

export const fetchFailPdexV3Trade = () => {
  StoreService?.current?.dispatch(tradeSlice.actions.fetchFail());
};
