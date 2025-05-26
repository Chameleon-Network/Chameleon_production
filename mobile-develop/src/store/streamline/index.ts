import { createSlice } from '@reduxjs/toolkit';
import { CONSTANT_KEYS } from '@src/constants';
import { StoreService } from '..';

const initialState = {
  consolidated: 0,
  times: 1,
  isFetching: false,
  isFetched: false,
  isPending: false,
  UTXOS: [],
  isFetchingUTXOS: false,
  storage: {
    [CONSTANT_KEYS.UTXOS_DATA]: {
      data: {},
    },
  },
};

export const streamlineSlice = createSlice({
  name: 'streamline',
  initialState,
  reducers: {
    fetching: (state) => {
      return {
        ...state,
        isFetching: true,
      };
    },
    fetched: (state, action) => {
      const keySave = CONSTANT_KEYS.UTXOS_DATA;
      const storage = state?.storage;
      const { address, utxos } = action.payload;
      const data = storage[keySave]?.data || {};
      const addressData = data[address] || [];
      const newData = { ...data, [address]: [...addressData, ...utxos] };
      return {
        ...state,
        storage: {
          ...storage,
          [keySave]: {
            ...storage[keySave],
            data: newData,
          },
        },
        consolidated: state.consolidated + 1,
        isPending: true,
      };
    },
    fetchedAllTXS: (state) => {
      return {
        ...state,
        isFetching: false,
        isFetched: true,
      };
    },
    initProcess: (state, action) => {
      const { times } = action.payload;
      return {
        ...state,
        consolidated: 0,
        times,
      };
    },
    togglePending: (state, action) => {
      return {
        ...state,
        isPending: action.payload,
      };
    },
    removeLocalUTXOS: (state, action) => {
      const keySave = CONSTANT_KEYS.UTXOS_DATA;
      const storage = state?.storage;
      const { address } = action.payload;
      const data = storage[keySave]?.data || {};
      const newData = { ...data, [address]: [] };
      return {
        ...state,
        storage: {
          ...storage,
          [keySave]: {
            ...storage[keySave],
            data: newData,
          },
        },
      };
    },
    fetchedUTXO: (state, action) => {
      return {
        ...state,
        UTXOS: action.payload,
      };
    },
    clearStreamline: (state) => {
      return {
        ...state,
        consolidated: 0,
        times: 1,
        isFetching: false,
        isFetched: false,
        isPending: false,
        UTXOS: [],
      };
    },
    fetchingUTXOS: (state, action) => {
      return {
        ...state,
        isFetchingUTXOS: action.payload,
      };
    },
  },
});

export const actionFetchingStreamline = () => {
  StoreService?.current?.dispatch(streamlineSlice.actions.fetching());
};

export const actionFetchedStreamline = (data) => {
  StoreService?.current?.dispatch(streamlineSlice.actions.fetched(data));
};

export const actionFetchedAllTXSStreamline = () => {
  StoreService?.current?.dispatch(streamlineSlice.actions.fetchedAllTXS());
};

export const actionInitProcessStreamline = (data) => {
  StoreService?.current?.dispatch(streamlineSlice.actions.initProcess(data));
};

export const actionTogglePendingStreamline = (data) => {
  StoreService?.current?.dispatch(streamlineSlice.actions.togglePending(data));
};

export const actionRemoveLocalUTXOSStreamline = (data) => {
  StoreService?.current?.dispatch(streamlineSlice.actions.removeLocalUTXOS(data));
};


export const actionFetchedUTXOSStreamline = (data) => {
  StoreService?.current?.dispatch(streamlineSlice.actions.fetchedUTXO(data));
};

export const actionClearStreamline = () => {
  StoreService?.current?.dispatch(streamlineSlice.actions.clearStreamline());
};

export const actionFetchingUTXOSStreamline = (data) => {
  StoreService?.current?.dispatch(streamlineSlice.actions.fetchingUTXOS(data));
};






