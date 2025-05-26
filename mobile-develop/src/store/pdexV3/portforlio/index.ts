import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '@src/store';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: [],
  shareDetails: [],
  modal: {
    poolId: undefined,
  },
};

export const portfolioSlice = createSlice({
  name: 'portfolio', // This is the name of the slice, we will later use this name to access the slice from the store
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
    fetchFail: (state) => {
      return {
        ...state,
        isFetching: false,
        isFetched: false,
      };
    },
    setShareDetails: (state, action) => {
      return {
        ...state,
        shareDetails: action.payload,
      };
    },
    setPoolModal: (state, action) => {
      return {
        ...state,
        modal: {
          poolId: action.payload.poolId,
        },
      };
    },
    freeModal: state => {
      return {
        ...state,
        modal: {
          poolId: undefined,
        },
      };
    },
  },
});

export const fetchingPdexV3Portfolio = () => {
  StoreService?.current?.dispatch(portfolioSlice.actions.fetching());
};

export const fetchedPdexV3Portfolio = (data: {}) => {
  StoreService?.current?.dispatch(portfolioSlice.actions.fetched(data));
  return data;
};

export const freeModalPdexV3Portfolio = () => {
  StoreService?.current?.dispatch(portfolioSlice.actions.freeModal());
};

export const setShareDetailsPdexV3Portfolio = (shareDetails: any) => {
  StoreService?.current?.dispatch(
    portfolioSlice.actions.setShareDetails(shareDetails),
  );
  return shareDetails;
};

export const setPoolModalPdexV3Portfolio = (poolId: string) => {
  StoreService?.current?.dispatch(
    portfolioSlice.actions.setPoolModal({poolId}),
  );
};

export const fetchFailPdexV3Portfolio = () => {
  StoreService?.current?.dispatch(portfolioSlice.actions.fetchFail());
};
