import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';
import {remove, unionBy} from 'lodash';

export const LIMIT_RECEIVE_HISTORY_ITEM = 20;
export const MAX_LIMIT_RECEIVE_HISTORY_ITEM = 50;

const initialState = {
  followed: [],
  pTokens: [],
  internalTokens: [],
  isGettingBalance: [],
  history: {
    isFetching: false,
    isFetched: false,
    histories: [],
    isEmpty: false,
    refreshing: true,
  },
  toggleUnVerified: false,
  receiveHistory: {
    isFetching: false,
    isFetched: false,
    data: [],
    oversize: false,
    page: 0,
    limit: LIMIT_RECEIVE_HISTORY_ITEM,
    refreshing: true,
    tokenId: null,
    notEnoughData: false,
  },
};

const _setToken = (list, token) => {
  let newList = [...list];
  try {
    const foundIndex = list.findIndex(t => t.id === token.id);
    if (foundIndex >= 0) {
      newList[foundIndex] = {...newList[foundIndex], ...token};
    } else {
      newList.push(token);
    }
  } catch (e) {
    throw new Error('Save token failed');
  }
  return newList;
};

const _removeTokenById = (list, tokenId) => {
  let newList = [...list];
  try {
    newList = remove(newList, t => t.id === tokenId);
  } catch (e) {
    throw new Error('Remove token failed');
  }
  return newList;
};

const _setBulkToken = (list, tokens) => {
  let newList = [...list];
  try {
    newList = unionBy(tokens, list, 'id');
  } catch (e) {
    throw new Error('Save tokens failed');
  }
  return newList;
};

const _setListToken = (list, tokens) => {
  const newTokens = tokens?.map(token => {
    const cachedToken = list?.find(t => t.id === token.id);

    // if cached token (in redux store) has its amount, keep it!
    if (cachedToken?.amount) {
      token.amount = cachedToken.amount;
    }
    return token;
  });

  return newTokens;
};

const _setGettingBalance = (list, tokenSymbol) => {
  const newList = [...list];
  return newList.includes(tokenSymbol) ? newList : [...newList, tokenSymbol];
};

const _removeGettingBalance = (list, tokenSymbol) => {
  const newList = [...list];
  remove(newList, item => item === tokenSymbol);
  return newList;
};

export const tokenSlice = createSlice({
  name: 'token', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    addPToken: (state, action) => {
      const newList = [...state.pTokens, action.payload];
      return {
        ...state,
        pTokens: newList,
      };
    },
    setToken: (state, action) => {
      const newList = _setToken(state.followed, action.payload);
      return {
        ...state,
        pTokens: newList,
      };
    },
    setBulkToken: (state, action) => {
      const newList = _setBulkToken(state.followed, action.payload);
      return {
        ...state,
        pTokens: newList,
      };
    },
    setGettingBalance: (state, action) => {
      const newList = _setGettingBalance(
        state.isGettingBalance,
        action.payload,
      );
      return {
        ...state,
        isGettingBalance: newList,
      };
    },
    removeTokenById: (state, action) => {
      const newList = _removeTokenById(state.followed, action.payload);
      return {
        ...state,
        followed: newList,
      };
    },
    setListToken: (state, action) => {
      const newList = _setListToken(state.followed, action.payload);
      return {
        ...state,
        followed: newList,
      };
    },
    setPTokenList: (state, action) => {
      const newList = _setListToken(state.pTokens, action.payload);
      return {
        ...state,
        pTokens: newList,
      };
    },
    setInternalTokenList: state => {
      return {
        ...state,
        // TEST_REMOVE_LOGIC
        // internalTokens: setListToken(state.followed, action.data),
        internalTokens: [],
      };
    },
    syncTokenHistory: (state, action) => {
      return {
        ...state,
        histories: [...action.payload],
        isEmpty: action.payload.length === 0,
      };
    },
    freeHistory: (state, action) => {
      return {
        ...state,
        history: {...initialState.history},
      };
    },
    setSelectedPrivacy: (state, action) => {
      return {
        ...state,
        history: {
          ...initialState.history,
        },
        receiveHistory: {
          ...initialState.receiveHistory,
          tokenId: action.payload,
        },
      };
    },
    toggleUnVerified: state => {
      return {
        ...state,
        toggleUnVerified: !state.toggleUnVerified,
      };
    },
    freeReceiveHistory: state => {
      return {
        ...state,
        receiveHistory: {...initialState.receiveHistory},
      };
    },
    syncReceiveHistory: (state, action) => {
      const {nextPage, data, oversize, refreshing, notEnoughData} =
        action?.payload;
      return {
        ...state,
        receiveHistory: {
          ...state.receiveHistory,
          data: [...data],
          page: refreshing ? state?.receiveHistory?.page : nextPage,
          oversize,
          refreshing: false,
          notEnoughData,
        },
      };
    },
  },
});

export const addPToken = ptokens => {
  StoreService?.current?.dispatch(tokenSlice.actions.addPToken(ptokens));
  return ptokens;
};

export const setToken = token => {
  StoreService?.current?.dispatch(tokenSlice.actions.setToken(token));
  return token;
};

export const setBulkToken = tokens => {
  StoreService?.current?.dispatch(tokenSlice.actions.setBulkToken(tokens));
  return tokens;
};

export const removeTokenById = tokenId => {
  StoreService?.current?.dispatch(tokenSlice.actions.removeTokenById(tokenId));
  return tokenId;
};

export const setListToken = tokens => {
  StoreService?.current?.dispatch(tokenSlice.actions.setListToken(tokens));
  return tokens;
};

export const setPTokenList = tokens => {
  StoreService?.current?.dispatch(tokenSlice.actions.setPTokenList(tokens));
  return tokens;
};

export const setInternalTokenList = () => {
  StoreService?.current?.dispatch(tokenSlice.actions.setInternalTokenList());
  return;
};

export const syncTokenHistory = histories => {
  StoreService?.current?.dispatch(
    tokenSlice.actions.syncTokenHistory(histories),
  );
  return histories;
};

export const freeHistory = () => {
  StoreService?.current?.dispatch(tokenSlice.actions.freeHistory());
  return;
};

export const setSelectedPrivacy = tokenId => {
  StoreService?.current?.dispatch(
    tokenSlice.actions.setSelectedPrivacy(tokenId),
  );
  return tokenId;
};

export const toggleUnVerified = () => {
  StoreService?.current?.dispatch(tokenSlice.actions.toggleUnVerified());
  return;
};

export const freeReceiveHistory = () => {
  StoreService?.current?.dispatch(tokenSlice.actions.freeReceiveHistory());
  return;
};

export const syncReceiveHistory = ({
  nextPage,
  data,
  oversize,
  refreshing,
  notEnoughData,
}) => {
  StoreService?.current?.dispatch(
    tokenSlice.actions.syncReceiveHistory({
      nextPage,
      data,
      oversize,
      refreshing,
      notEnoughData,
    }),
  );
  return;
};

export const setGettingBalance = tokenSymbol => {
  StoreService?.current?.dispatch(
    tokenSlice.actions.setGettingBalance(tokenSymbol),
  );
  return tokenSymbol;
};
