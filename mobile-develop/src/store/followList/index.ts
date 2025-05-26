import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

const initialState = {
  data: {},
};

const setToken = ({OTAKey, token, data}) => {
  let newList = [...(data[OTAKey] || [])];
  const foundIndex = newList.findIndex(t => t.id === token.id);
  if (foundIndex >= 0) {
    newList[foundIndex] = {...newList[foundIndex], ...token};
  }
  return newList;
};

export const followListSlice = createSlice({
  name: 'followWallet', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    setBalance: (state, action) => {
      const {balance, OTAKey} = action.payload;
      return {
        ...state,
        isFetching: false,
        data: Object.assign(state.data, {[OTAKey]: balance}),
      };
    },
    updateTokenList: (state, action) => {
      const {newTokens, OTAKey} = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [OTAKey]: newTokens,
        },
      };
    },
    setTokenBalance: (state, action) => {
      const {token, OTAKey} = action.payload;
      const newList = setToken({OTAKey, token, data: state.data});
      return {
        ...state,
        data: {
          ...state.data,
          [OTAKey]: newList,
        },
      };
    },
  },
});

export const setBalance = ({
  balance,
  OTAKey,
}: {
  balance: {};
  OTAKey: string;
}) => {
  StoreService?.current?.dispatch(
    followListSlice.actions.setBalance({balance, OTAKey}),
  );
  return balance;
};

export const updateTokenList = ({
  newTokens,
  OTAKey,
}: {
  newTokens: {};
  OTAKey: string;
}) => {
  StoreService?.current?.dispatch(
    followListSlice.actions.updateTokenList({newTokens, OTAKey}),
  );
  return newTokens;
};

export const setTokenBalance = ({
  token,
  OTAKey,
}: {
  token: {};
  OTAKey: string;
}) => {
  StoreService?.current?.dispatch(
    followListSlice.actions.setTokenBalance({token, OTAKey}),
  );
  return token;
};
