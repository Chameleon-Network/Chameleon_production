import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '@src/store';

const initialState = {
  isFetching: false,
  isFetched: false,
  poolid: '',
  orderBook: {
    data: {
      buy: [],
      sell: [],
    },
    decimal: 0.1,
  },
  priceHistory: {
    data: [],
    period: '1d',
    datapoint: 100,
    fetching: false,
  },
  tradingVolume24: '',
};

export const chartSlice = createSlice({
  name: 'chart', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setPoolId: (state, action) => {
      return {
        ...state,
        poolid: action.payload,
      };
    },
    setSelectedPoolId: (state, action) => {
      return {
        ...state,
        poolid: action.payload,
      };
    },
    fetchedOrderBook: (state, action) => {
      return {
        ...state,
        orderBook: {
          ...state.orderBook,
          data: action.payload,
        },
      };
    },
    changePeriod: (state, action) => {
      return {
        ...state,
        priceHistory: {
          ...state.priceHistory,
          period: action.payload,
        },
      };
    },
    fetchingPriceHistory: (state) => {
      return {
        ...state,
        priceHistory: {
          ...state.priceHistory,
          fetching: true,
        },
      };
    },
    fetchedPriceHistory: (state, action) => {
      return {
        ...state,
        priceHistory: {
          ...state.priceHistory,
          ...action.payload,
          fetching: false,
        },
      };
    },
    fetching: (state) => {
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
        data: { ...action.payload },
      };
    },
    fetchFail: (state) => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
      };
    },
    reset: () => {
      return {
        ...initialState,
      };
    },
  },
});


export const setPoolIdChartPDexV3 = (payload: string) => {
  StoreService?.current?.dispatch(chartSlice.actions.setPoolId(payload));
};

export const setSelectedPoolIdChartPDexV3 = (payload: string) => {
  StoreService?.current?.dispatch(chartSlice.actions.setSelectedPoolId(payload));
};

export const changePeriodChartPDexV3 = (payload: string) => {
  StoreService?.current?.dispatch(chartSlice.actions.changePeriod(payload));
};

export const fetchedOrderBookChartPDexV3 = (data: {}) => {
  StoreService?.current?.dispatch(chartSlice.actions.fetchedOrderBook(data));
  return data;
};

export const fetchingPriceHistoryChartPDexV3 = () => {
  StoreService?.current?.dispatch(chartSlice.actions.fetchingPriceHistory());
};

export const fetchedPriceHistoryChartPDexV3 = (data: {}) => {
  StoreService?.current?.dispatch(chartSlice.actions.fetchedPriceHistory(data));
};

export const fetchingChartPDexV3 = () => {
  StoreService?.current?.dispatch(chartSlice.actions.fetching());
};

export const fetchedChartPDexV3 = (data: {}) => {
  StoreService?.current?.dispatch(chartSlice.actions.fetched(data));
};

export const fetchFailChartPDexV3 = () => {
  StoreService?.current?.dispatch(chartSlice.actions.fetchFail());
};

export const resetChartPDexV3 = () => {
  StoreService?.current?.dispatch(chartSlice.actions.reset());
};
