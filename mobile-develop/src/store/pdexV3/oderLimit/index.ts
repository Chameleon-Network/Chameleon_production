import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '@src/store';
import { PRV_ID } from '@src/constants/common';
import { ACCOUNT_CONSTANT } from 'incognito-chain-web-js/build/wallet';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: {},
  poolId: '',
  buytoken: '',
  selltoken: '',
  feetoken: PRV_ID,
  estimateTrade: null,
  focustoken: '',
  networkfee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  swapingToken: false,
  selecting: false,
  initing: false,
  rate: '',
  percent: 0,
  ordersHistory: {
    isFetching: false,
    isFetched: false,
    data: [],
  },
  openOrders: {
    isFetching: false,
    isFetched: false,
    data: [],
  },
  withdrawingOrderTxs: [],
  withdrawOrderTxs: [],
  ordering: false,
  orderDetail: {
    order: {},
    fetching: false,
  },
};

export const orderLimitSlice = createSlice({
  name: 'orderLimit', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    fetchingOrderDetail: (state) => {
      const { orderDetail } = state;
      return {
        ...state,
        orderDetail: {
          ...orderDetail,
          fetching: true,
        },
      };
    },
    fetchedOrderDetail: (state, action) => {
      const { orderDetail } = state;
      return {
        ...state,
        orderDetail: {
          ...orderDetail,
          fetching: false,
          order: action.payload,
        },
      };
    },
    resetOrdersHistory: (state, action) => {
      const { field } = action.payload;
      return {
        ...state,
        [field]: { ...initialState[field] },
      };
    },
    fetchingOrdersHistory: (state, action) => {
      const { field } = action.payload;
      return {
        ...state,
        [field]: { ...state[field], isFetching: true },
      };
    },
    fetchedOrdersHistory: (state, action) => {
      const { field, data } = action.payload;
      return {
        ...state,
        [field]: {
          ...state[field],
          isFetching: false,
          isFetched: true,
          data,
        },
      };
    },
    fetchFailOrdersHistory: (state, action) => {
      const { field } = action.payload;
      return {
        ...state,
        [field]: {
          ...state[field],
          isFetched: false,
          isFetching: false,
        },
      };
    },
    fetchOrdering: (state, action) => {
      return {
        ...state,
        ordering: action.payload,
      };
    },
    fetchedWithdrawingOrderTxs: (state, action) => {
      return {
        ...state,
        withdrawOrderTxs: [...action.payload],
      };
    },
    withdrawingOrder: (state, action) => {
      const { withdrawingOrderTxs } = state;
      const requesttx = action.payload;
      const isExited = withdrawingOrderTxs.includes(requesttx);
      return {
        ...state,
        withdrawingOrderTxs: isExited
          ? [...withdrawingOrderTxs].filter((txId) => txId !== requesttx)
          : [requesttx, ...withdrawingOrderTxs],
      };
    },
    fetchedOpenOrders: (state, action) => {
      return {
        ...state,
        orders: [...action.payload],
      };
    },
    fetching: (state, action) => {
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
      };
    },
    fetchFail: (state, action) => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
      };
    },
    setPoolId: (state, action) => {
      return {
        ...state,
        poolId: action.payload,
      };
    },
    setIniting: (state, action) => {
      return {
        ...state,
        initing: action.payload,
      };
    },
    setSellToken: (state, action) => {
      return {
        ...state,
        selltoken: action.payload,
      };
    },
    setBuyToken: (state, action) => {
      return {
        ...state,
        buytoken: action.payload,
      };
    },
    setFeeToken: (state, action) => {
      return {
        ...state,
        feetoken: action.payload,
      };
    },
    setFocusToken: (state, action) => {
      return {
        ...state,
        focustoken: action.payload,
      };
    },
    setPercent: (state, action) => {
      return {
        ...state,
        percent: action.payload,
      };
    },
    reset: () => {
      return initialState;
    },
  },
});

export const fetchingOrderDetailOderLimitPdexV3 = () => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchingOrderDetail(),
  );
  return true;
};

export const fetchedOrderDetailOderLimitPdexV3 = (oderDetail: any) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchedOrderDetail(oderDetail),
  );
  return true;
};

export const resetOrdersHistoryOderLimitPdexV3 = (field: { field: string }) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.resetOrdersHistory({ field }),
  );
  return true;
};

export const fetchingOrdersHistoryOderLimitPdexV3 = (field: string) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchingOrdersHistory({ field }),
  );
  return true;
};

export const fetchedOrdersHistoryOderLimitPdexV3 = ({ field, data }: { field: string, data: any }) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchedOrdersHistory({ field, data }),
  );
  return true;
};

export const fetchFailOrdersHistoryOderLimitPdexV3 = ({ field }: { field: string }) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchFailOrdersHistory({ field }),
  );
  return true;
};

export const fetchOrderingOderLimitPdexV3 = (ordering: any) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchOrdering(ordering),
  );
  return true;
};

export const fetchedWithdrawingOrderTxsOderLimitPdexV3 = (withdrawingOrderTxs: any) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchedWithdrawingOrderTxs(withdrawingOrderTxs),
  );
  return true;
};

export const withdrawingOrderOderLimitPdexV3 = (withdrawingOrderTxs: any) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.withdrawingOrder(withdrawingOrderTxs),
  );
  return true;
};

export const fetchedOpenOrdersOderLimitPdexV3 = (orders: any) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchedOpenOrders(orders),
  );
  return true;
};

export const fetchingOderLimitPdexV3 = () => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetching(),
  );
  return true;
};

export const fetchedOderLimitPdexV3 = () => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetched(),
  );
  return true;
};

export const fetchFailOderLimitPdexV3 = () => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.fetchFail(),
  );
  return true;
};

export const setPoolIdOderLimitPdexV3 = (poolId: string) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.setPoolId(poolId),
  );
  return true;
};

export const setInitingOderLimitPdexV3 = (initing: boolean) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.setIniting(initing),
  );
  return true;
};

export const setSellTokenOderLimitPdexV3 = (selltoken: string) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.setSellToken(selltoken),
  );
  return true;
};

export const setBuyTokenOderLimitPdexV3 = (buytoken: string) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.setBuyToken(buytoken),
  );
  return true;
};

export const setFeeTokenOderLimitPdexV3 = (feetoken: string) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.setFeeToken(feetoken),
  );
  return true;
};

export const setFocusTokenOderLimitPdexV3 = (focustoken: string) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.setFocusToken(focustoken),
  );
  return true;
};

export const setPercentOderLimitPdexV3 = (percent: number) => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.setPercent(percent),
  );
  return true;
};

export const resetOderLimitPdexV3 = () => {
  StoreService?.current?.dispatch(
    orderLimitSlice.actions.reset(),
  );
  return true;
};
