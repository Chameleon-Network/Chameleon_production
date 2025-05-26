import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '@src/store';

const contributeState = {
  isFetching: false,
  histories: [],
};

const removeLPState = {
  isFetching: false,
  histories: [],
};

const withdrawFeeLPState = {
  isFetching: false,
  histories: [],
};

const initialState = {
  contribute: {
    ...contributeState,
  },
  removeLP: {
    ...removeLPState,
  },
  withdrawFeeLP: {
    ...withdrawFeeLPState,
  },
};

export const liquidityHistoriesSlice = createSlice({
  name: 'liquidityHistories', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setFetchingContributeHistories: (state, action) => {
      const {isFetching} = action.payload;
      return {
        ...state,
        contribute: {
          ...state.contribute,
          isFetching,
        },
      };
    },
    setFetchingRemoveHistories: (state, action) => {
      const {isFetching} = action.payload;
      return {
        ...state,
        removeLP: {
          ...state.removeLP,
          isFetching,
        },
      };
    },
    setContributeHistories: (state, action) => {
      const {histories} = action.payload;
      return {
        ...state,
        contribute: {
          ...state.contribute,
          histories,
        },
      };
    },
    setRemoveHistories: (state, action) => {
      const {histories} = action.payload;
      return {
        ...state,
        removeLP: {
          ...state.removeLP,
          histories,
        },
      };
    },
    setWithdrawFeeHistories: (state, action) => {
      const {histories} = action.payload;
      return {
        ...state,
        withdrawFeeLP: {
          ...state.withdrawFeeLP,
          histories,
        },
      };
    },
  },
});

export const setFetchingContributeHistories = payload => {
  StoreService?.current?.dispatch(
    liquidityHistoriesSlice.actions.setFetchingContributeHistories(payload),
  );
};

export const setFetchingRemoveHistories = payload => {
  StoreService?.current?.dispatch(
    liquidityHistoriesSlice.actions.setFetchingRemoveHistories(payload),
  );
};

export const setContributeHistories = payload => {
  StoreService?.current?.dispatch(
    liquidityHistoriesSlice.actions.setContributeHistories(payload),
  );
};

export const setRemoveHistories = payload => {
  StoreService?.current?.dispatch(
    liquidityHistoriesSlice.actions.setRemoveHistories(payload),
  );
};
export const setWithdrawFeeHistories = payload => {
  StoreService?.current?.dispatch(
    liquidityHistoriesSlice.actions.setWithdrawFeeHistories(payload),
  );
};
