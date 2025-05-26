import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '@src/store';

const initialState = {
  tradingVolume24h: 0,
  pairID: undefined,
  listPools: [],
  listPoolsFollowing: [],
  followIds: [],
};

export const poolsSlice = createSlice({
  name: 'pools', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    syncTradingVolume24h: (state, action) => {
      return {
        ...state,
        tradingVolume24h: action.payload,
      };
    },
    syncListPools: (state, action) => {
      return {
        ...state,
        listPools: action.payload,
      };
    },
    freeListPools: state => {
      return {
        ...state,
        listPools: [],
      };
    },
    syncListPoolsDetail: state => {
      return {
        ...state,
        listPoolsDetail: action.payload,
      };
    },
    syncListPoolsFollowing: (state, action) => {
      const {followIds} = action.payload;
      return {
        ...state,
        followIds: followIds || [],
      };
    },
    reset: () => initialState,
  },
});

export const syncTradingVolume24h = (tradingVolume24h: {}) => {
  StoreService?.current?.dispatch(
    poolsSlice.actions.syncTradingVolume24h(tradingVolume24h),
  );
  return tradingVolume24h;
};

export const syncListPools = (listPools: {}) => {
  StoreService?.current?.dispatch(poolsSlice.actions.syncListPools(listPools));
  return listPools;
};

export const freeListPools = () => {
  StoreService?.current?.dispatch(poolsSlice.actions.freeListPools());
};

export const syncListPoolsDetail = (listPoolsDetail: any) => {
  StoreService?.current?.dispatch(
    poolsSlice.actions.syncListPoolsDetail(listPoolsDetail),
  );
  return listPoolsDetail;
};

export const syncListPoolsFollowing = ({followIds}: {followIds: any}) => {
  StoreService?.current?.dispatch(poolsSlice.actions.syncListPoolsFollowing({followIds}));
  return followIds;
};

export const resetPools = () => {
  StoreService?.current?.dispatch(poolsSlice.actions.reset());
};
