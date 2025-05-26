import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';
import {CONSTANT_KEYS} from '@src/constants';

const initialState = {
  isFetching: false,
  isFetched: false,
  txsTransactor: [],
  txsReceiver: [],
  txsPToken: [],
  txsPortal: [],
  txsUnshield: [],
  detail: {
    fetching: false,
    tx: null,
  },
};

export const historySlice = createSlice({
  name: 'history', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    fetching: state => {
      return {
        ...state,
        isFetching: true,
      };
    },
    fetched: (state, action) => {
      const {txsTransactor, txsReceiver, txsPToken, txsPortal, txsUnshield} =
        action.payload;
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        txsTransactor: [...txsTransactor],
        txsReceiver: [...txsReceiver],
        txsPToken: [...txsPToken],
        txsPortal: [...txsPortal],
        txsUnshield: [...txsUnshield],
      };
    },
    fetchFail: state => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
      };
    },
    fetchFree: () => {
      return {...initialState};
    },
    setSelectedTx: (state, action) => {
      return {
        ...state,
        detail: {
          ...state.detail,
          tx: {...action.payload},
        },
      };
    },
    fetchingTx: state => {
      return {
        ...state,
        detail: {
          ...state.detail,
          fetching: true,
        },
      };
    },
    fetchedTx: (state, action) => {
      return {
        ...state,
        detail: {
          ...state.detail,
          tx: {...action.payload},
          fetching: false,
        },
      };
    },
    freeHistoryDetail: state => {
      return {
        ...state,
        txsTransactor: [],
        txsReceiver: [],
        txsPToken: [],
        txsPortal: [],
        txsUnshield: [],
      };
    },
  },
});

export const fetchingHistory = () => {
  StoreService?.current?.dispatch(historySlice.actions.fetching());
};

export const fetchedHistory = (payload) => {
  StoreService?.current?.dispatch(historySlice.actions.fetched(payload));
};

export const fetchFailHistory = () => {
  StoreService?.current?.dispatch(historySlice.actions.fetchFail());
};

export const fetchFreeHistory = () => {
  StoreService?.current?.dispatch(historySlice.actions.fetchFree());
};

export const setSelectedTx = (payload) => {
  StoreService?.current?.dispatch(historySlice.actions.setSelectedTx(payload));
};

export const fetchingTx = () => {
  StoreService?.current?.dispatch(historySlice.actions.fetchingTx());
};

export const fetchedTx = (payload) => {
  StoreService?.current?.dispatch(historySlice.actions.fetchedTx(payload));
};

export const freeHistoryDetail = () => {
  StoreService?.current?.dispatch(historySlice.actions.freeHistoryDetail());
};
