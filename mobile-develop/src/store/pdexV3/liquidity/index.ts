import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '@src/store';
import { ACCOUNT_CONSTANT, PRVIDSTR } from 'incognito-chain-web-js/build/wallet';

const contributeState = {
  isFetching: false,
  poolId: '',
  nftId: '',
  data: undefined,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX * 2,
  feeToken: PRVIDSTR,
};

const createPoolState = {
  focusField: undefined,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX * 2,
  feeToken: PRVIDSTR,
  amp: undefined,
  rate: undefined,
  isFetching: false,
  isTyping: false,
};

const removePoolState = {
  shareId: '',
  isFetching: false,
  isFetched: false,
  inputToken: undefined,
  outputToken: undefined,
  feeAmount: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  feeToken: PRVIDSTR,
};

const initialState = {
  contribute: {
    ...contributeState,
  },
  createPool: {
    ...createPoolState,
  },
  removePool: {
    ...removePoolState,
  },
};

export const liquiditySlice = createSlice({
  name: 'liquidity', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    setContributeId: (state, action) => {
      const { poolId, nftId } = action.payload;
      return {
        ...state,
        contribute: {
          ...state.contribute,
          poolId,
          nftId,
        },
      };
    },
    fetchingContributeData: (state, action) => {
      const { isFetching } = action.payload;
      return {
        ...state,
        contribute: {
          ...state.contribute,
          isFetching,
        },
      };
    },
    setContributePoolData: (state, action) => {
      const { data, inputToken, outputToken } = action.payload;
      return {
        ...state,
        contribute: {
          ...state.contribute,
          data,
          inputToken,
          outputToken,
        },
      };
    },
    createPoolToken: (state, action) => {
      return {
        ...state,
        createPool: {
          ...state.createPool,
          ...action.payload,
        },
      };
    },
    freeCreatePoolToken: state => {
      return {
        ...state,
        createPool: {
          ...createPoolState,
        },
      };
    },
    setFetchingCraetePool: (state, action) => {
      const { isFetching } = action.payload;
      return {
        ...state,
        createPool: {
          ...state.createPool,
          isFetching,
        },
      };
    },
    setFocusCreatePool: (state, action) => {
      const { focusField } = action.payload;
      return {
        ...state,
        createPool: {
          ...state.createPool,
          focusField,
        },
      };
    },
    setTypingCreatePool: (state, action) => {
      const { isTyping } = action.payload;
      return {
        ...state,
        createPool: {
          ...state.createPool,
          isTyping,
        },
      };
    },
    setRateCreatePool: (state, action) => {
      const { amp, rate } = action.payload;
      return {
        ...state,
        createPool: {
          ...state.createPool,
          amp,
          rate,
        },
      };
    },
    setRemovePoolToken: (state, action) => {
      return {
        ...state,
        removePool: {
          ...state.removePool,
          ...action.payload,
        },
      };
    },
    setRemoveShareId: (state, action) => {
      return {
        ...state,
        removePool: {
          ...state.removePool,
          shareId: action.payload,
        },
      };
    },
    free: state => {
      return {
        ...state,
        contribute: {
          ...contributeState,
        },
        createPool: {
          ...createPoolState,
        },
        removePool: {
          ...removePoolState,
        },
      };
    },
  },
});

export const setContributeIdLiquidityPdexV3 = ({
  poolId,
  nftId,
}: {
  poolId: string;
  nftId: string;
}) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setContributeId({ poolId, nftId }),
  );
};

export const fetchingContributeDataLiquidityPdexV3 = ({ isFetching }: { isFetching: boolean }) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.fetchingContributeData({ isFetching }),
  );
};

export const setContributePoolDataLiquidityPdexV3 = (
  { data,
    inputToken,
    outputToken,
  }: {
    data: any,
    inputToken: any,
    outputToken: any,
  }) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setContributePoolData({
      data,
      inputToken,
      outputToken,
    }),
  );
};

export const createPoolTokenLiquidityPdexV3 = (payload: any) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.createPoolToken(payload),
  );
};

export const freeCreatePoolTokenLiquidityPdexV3 = () => {
  StoreService?.current?.dispatch(liquiditySlice.actions.freeCreatePoolToken());
};

export const setFetchingCraetePoolLiquidityPdexV3 = ({ isFetching }: { isFetching: boolean }) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setFetchingCraetePool({ isFetching }),
  );
};

export const setFocusCreatePoolLiquidityPdexV3 = ({ focusField }: { focusField: string }) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setFocusCreatePool({ focusField }),
  );
};

export const setTypingCreatePoolLiquidityPdexV3 = ({ isTyping }: { isTyping: boolean }) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setTypingCreatePool({ isTyping }),
  );
};

export const setRateCreatePoolLiquidityPdexV3 = ({ amp, rate }: { amp: number, rate: number }) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setRateCreatePool({ amp, rate }),
  );
};

export const setRemovePoolTokenLiquidityPdexV3 = (payload: any) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setRemovePoolToken(payload),
  );
};

export const setRemoveShareIdLiquidityPdexV3 = (shareId: string) => {
  StoreService?.current?.dispatch(
    liquiditySlice.actions.setRemoveShareId(shareId),
  );
};

export const freeLiquidityPdexV3 = () => {
  StoreService?.current?.dispatch(liquiditySlice.actions.free());
};
