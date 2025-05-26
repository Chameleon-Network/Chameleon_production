import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '..';

const initialState = {
  isFetching: false,
  isFetched: false,
  isFetchFailed: false,
  isPortalCompatible: true,
  data: {
    min: null,
    max: null,
    address: '',
    expiredAt: '',
    decentralized: undefined,
    tokenFee: 0,
    estimateFee: 0,
    isPortal: false,
  },
  storage: {
    guide: false,
  },
};

export const shieldSlice = createSlice({
  name: 'shield',
  initialState: initialState,
  reducers: {
    fetching: (state) => {
      return {
        ...state,
        isFetching: true,
        isFetchFailed: false,
      };
    },
    fetched: (state, action) => {
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        isFetchFailed: false,
        data: { ...action.payload },
      };
    },
    fetchFailed: (state, action) => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
        isFetchFailed: true,
        isPortalCompatible: action.payload,
      };
    },
    toggleGuide: (state) => {
      return {
        ...state,
        storage: {
          ...state.storage,
          guide: true,
        },
      };
    },
    reset: (state) => {
      return {
        ...initialState,
        storage: state.storage,
      };
    },
  },
});

export const fetchingShield = () => {
  return StoreService?.current?.dispatch(shieldSlice.actions.fetching());
};

export const fetchedShield = (data: any) => {
  return StoreService?.current?.dispatch(shieldSlice.actions.fetched(data));
};

export const fetchFailedShield = (isPortalCompatible: boolean) => {
  return StoreService?.current?.dispatch(shieldSlice.actions.fetchFailed(isPortalCompatible));
};

export const toggleGuideShield = () => {
  return StoreService?.current?.dispatch(shieldSlice.actions.toggleGuide());
};

export const resetShield = () => {
  return StoreService?.current?.dispatch(shieldSlice.actions.reset());
};
  