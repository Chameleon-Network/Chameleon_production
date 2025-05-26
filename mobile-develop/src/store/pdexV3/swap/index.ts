import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '@src/store';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';
import {KEYS_PLATFORMS_SUPPORTED, PLATFORMS_SUPPORTED} from './constants';
import {PRV_ID} from '@src/constants';
import {getStore} from '@src/store/types';
import {ActionSaveUnifiedAlertStateByIdPayload} from './types';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: {
    [KEYS_PLATFORMS_SUPPORTED.incognito]: {
      // incognito
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.pancake]: {
      // pancake
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.uni]: {
      // uni
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.uniEther]: {
      // uniEther
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.curve]: {
      // curve
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.spooky]: {
      // spooky
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.joe]: {
      // joe
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.trisolaris]: {
      // trisolaris
      feePrv: {},
      feeToken: {},
      error: null,
    },
    [KEYS_PLATFORMS_SUPPORTED.interswap]: {
      // trisolaris
      feePrv: {},
      feeToken: {},
      error: null,
    },
  },
  buytoken: '',
  selltoken: '',
  feetoken: PRV_ID,
  estimateTrade: null,
  focustoken: '',
  networkfee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
  swapingToken: false,
  selecting: false,
  initing: false,
  percent: 0,
  swaping: false,
  pairs: [],
  swapHistory: {
    isFetching: false,
    isFetched: false,
    data: [],
  },
  orderDetail: {
    order: {},
    fetching: false,
  },
  toggleProTab: false,

  pancakeTokens: [],
  uniTokens: [],
  curveTokens: [],
  spookyTokens: [],
  interswapTokens: [],
  trisolarisTokens: [],
  joeTokens: [],

  platforms: [...PLATFORMS_SUPPORTED],
  field: '',
  useMax: false,
  defaultExchange: KEYS_PLATFORMS_SUPPORTED.incognito,
  isPrivacyApp: false,
  error: null,
  slippage: '0.5',
  resetSlippage1: false,
  rewardHistories: [],
  isUsePRVToPayFee: true,
  bestRateExchange: null,
  exchangeSupportsList: [],
  estimateTradeError: null,
  isNavigateFromMarketTab: false,
  unifiedInforAlertHash: {},
  estimateCount: 1,
  isNavigateToSelection: false,
};

export const swapSlice = createSlice({
  name: 'swap', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    changeSlippage: (state, action) => {
      return {
        ...state,
        slippage: action.payload,
      };
    },
    freeHistoryOrders: state => {
      return {
        ...state,
        swapHistory: Object.assign({}, initialState.swapHistory),
      };
    },
    setDefaultExchange: (state, action) => {
      let _isPrivacyApp = state.isPrivacyApp;
      const {exchange, isPrivacyApp = _isPrivacyApp} = action.payload;
      return {
        ...state,
        defaultExchange: exchange,
        platforms: state.platforms.map(platform =>
          isPrivacyApp && exchange === platform.id
            ? {...platform, visible: true}
            : {...platform, visible: false},
        ),
        isPrivacyApp,
      };
    },
    saveLastField: (state, action) => {
      return {
        ...state,
        field: action.payload,
      };
    },
    changeSelectedPlatform: (state, action) => {
      const platformID = action.payload;
      let feetoken = state.feetoken;
      switch (platformID) {
        case KEYS_PLATFORMS_SUPPORTED.pancake:
          feetoken = PRV_ID;
          break;
        case KEYS_PLATFORMS_SUPPORTED.uni:
        case KEYS_PLATFORMS_SUPPORTED.uniEther:
          feetoken = PRV_ID;
          break;
        case KEYS_PLATFORMS_SUPPORTED.curve:
          feetoken = PRV_ID;
          break;
        case KEYS_PLATFORMS_SUPPORTED.spooky:
          feetoken = PRV_ID;
          break;
        case KEYS_PLATFORMS_SUPPORTED.joe:
          feetoken = PRV_ID;
          break;
        case KEYS_PLATFORMS_SUPPORTED.trisolaris:
          feetoken = PRV_ID;
          break;
        default:
          feetoken = PRV_ID;
          break;
      }
      const newState = {
        ...state,
        platforms: [...state.platforms].map(platform => ({
          ...platform,
          isSelected: platformID === platform.id,
        })),
        // feetoken,
      };
      return newState;
    },
    toggleProTab: (state, action) => {
      return {
        ...state,
        toggleProTab: action.payload,
      };
    },
    setDefaultPair: (state, action) => {
      const {selltoken, buytoken} = action.payload;
      return {
        ...state,
        selltoken,
        buytoken,
      };
    },
    fetchingOrderDetail: state => {
      const {orderDetail} = state;
      return {
        ...state,
        orderDetail: {
          ...orderDetail,
          fetching: true,
        },
      };
    },
    fetchedOrderDetail: (state, action) => {
      const {orderDetail} = state;
      return {
        ...state,
        orderDetail: {
          ...orderDetail,
          fetching: false,
          order: {...action.payload},
        },
      };
    },
    fetchingOrdersHistory: state => {
      const {swapHistory} = state;
      return {
        ...state,
        swapHistory: {...swapHistory, isFetching: true},
      };
    },
    fetchedOrdersHistory: (state, action) => {
      const {swapHistory} = state;
      return {
        ...state,
        swapHistory: {
          ...swapHistory,
          isFetching: false,
          isFetched: true,
          data: [...action.payload],
        },
      };
    },
    fetchFailOrdersHistory: state => {
      const {swapHistory} = state;
      return {
        ...state,
        swapHistory: {
          ...swapHistory,
          isFetched: false,
          isFetching: false,
        },
      };
    },
    fetchedListPairs: (state, action) => {
      const {
        pairs,
        pancakeTokens,
        uniTokens,
        curveTokens,
        spookyTokens,
        joeTokens,
        trisolarisTokens,
        interswapTokens,
      } = action.payload;
      return {
        ...state,
        pairs,
        pancakeTokens,
        uniTokens,
        curveTokens,
        spookyTokens,
        joeTokens,
        trisolarisTokens,
        interswapTokens,
      };
    },
    fetchSwap: (state, action) => {
      return {
        ...state,
        swaping: action.payload,
      };
    },
    setPercent: (state, action) => {
      return {
        ...state,
        percent: action.payload,
      };
    },
    reset: state => {
      return Object.assign(
        {},
        {
          ...initialState,
          pancakeTokens: state.pancakeTokens,
          uniTokens: state.uniTokens,
          curveTokens: state.curveTokens,
          spookyTokens: state.spookyTokens,
          interswapTokens: state.interswapTokens,
          trisolarisTokens: state.trisolarisTokens,
          joeTokens: state.joeTokens,
          slippage: state.slippage,
          resetSlippage1: state.resetSlippage1,
          unifiedInforAlertHash: state.unifiedInforAlertHash,
          pairs: state.pairs,
        },
      );
    },
    resetData: state => {
      return {
        ...state,
        data: Object.assign({}, initialState.data),
      };
    },
    fetching: (state, action) => {
      return {
        ...state,
        isFetching: action.payload,
        // data: Object.assign({}, initialState.data),
      };
    },
    fetched: (state, action) => {
      return {
        ...state,
        isFetched: action.payload,
        isFetching: false,
      };
    },
    changeEstimateData: (state, action) => {
      const payload = action.payload;
      const newState = {
        ...state,
        data: {...state.data, ...payload},
      };
      return newState;
    },
    fetchFail: state => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
      };
    },
    setInitingSwap: (state, action) => {
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
    setSelectingToken: (state, action) => {
      return {
        ...state,
        selecting: action.payload,
      };
    },
    setSwapingToken: (state, action) => {
      return {
        ...state,
        swapingToken: action.payload,
      };
    },
    fetchedRewardHistory: (state, action) => {
      return {
        ...state,
        rewardHistories: action.payload,
      };
    },
    fetchFailRewardHistory: state => {
      return {
        ...state,
      };
    },
    setBestRateExchange: (state, action) => {
      return {
        ...state,
        bestRateExchange: action.payload,
      };
    },
    setExchangeSupportList: (state, action) => {
      return {
        ...state,
        exchangeSupportsList: action.payload,
      };
    },
    setResetSlippage: state => {
      return {
        ...state,
        resetSlippage1: true,
      };
    },
    setEstimateTradeError: (state, action) => {
      return {
        ...state,
        estimateTradeError: action.payload,
      };
    },

    setNavigateFromMarket: (state, action) => {
      return {
        ...state,
        isNavigateFromMarketTab: action.payload,
      };
    },

    setNavigateToSelection: (state, action) => {
      return {
        ...state,
        isNavigateToSelection: action.payload,
      };
    },

    resetExchangeSupported: state => {
      return {
        ...state,
        exchangeSupportsList: [],
      };
    },

    saveUnifiedAlertStateById: (state, action) => {
      const {paymentAddress, timeStamp, answer} = action.payload;
      const newUnifiedInforAlertHash = {...state.unifiedInforAlertHash};
      newUnifiedInforAlertHash[paymentAddress] = {
        timeStamp,
        answer,
      };
      return {
        ...state,
        unifiedInforAlertHash: newUnifiedInforAlertHash,
      };
    },
    setEstimateCount: (state, action) => {
      const {estimateCount} = state;
      const count = action.payload;
      return {
        ...state,
        estimateCount: count ? count : estimateCount + 1,
      };
    },
  },
});

export const changeSlippagePdexV3 = (slippage: string) => {
  StoreService?.current?.dispatch(swapSlice.actions.changeSlippage(slippage));
  return slippage;
};

export const freeHistoryOrdersPdexV3 = () => {
  getStore().dispatch(swapSlice.actions.freeHistoryOrders());
};

export const setDefaultExchangePdexV3 = ({
  exchange,
  isPrivacyApp,
}: {
  exchange: string;
  isPrivacyApp: boolean;
}) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setDefaultExchange({exchange, isPrivacyApp}),
  );
};

export const saveLastFieldPdexV3 = (field: string) => {
  StoreService?.current?.dispatch(swapSlice.actions.saveLastField(field));
};

export const changeSelectedPlatformPdexV3 = (platformID: string) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.changeSelectedPlatform(platformID),
  );
};

export const toggleProTabPdexV3 = (toggle: boolean) => {
  StoreService?.current?.dispatch(swapSlice.actions.toggleProTab(toggle));
};

export const setDefaultPairPdexV3 = ({
  selltoken,
  buytoken,
}: {
  selltoken: string;
  buytoken: string;
}) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setDefaultPair({selltoken, buytoken}),
  );
};

export const fetchingOrderDetailPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.fetchingOrderDetail());
};

export const fetchedOrderDetailPdexV3 = (order: any) => {
  StoreService?.current?.dispatch(swapSlice.actions.fetchedOrderDetail(order));
};

export const fetchingOrdersHistoryPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.fetchingOrdersHistory());
};

export const fetchedOrdersHistoryPdexV3 = (orders: any[]) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.fetchedOrdersHistory(orders),
  );
};

export const fetchFailOrdersHistoryPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.fetchFailOrdersHistory());
};

export const fetchedListPairsPdexV3 = ({
  pairs,
  pancakeTokens,
  uniTokens,
  curveTokens,
  spookyTokens,
  joeTokens,
  trisolarisTokens,
  interswapTokens,
}: {
  pairs: any[];
  pancakeTokens: any[];
  uniTokens: any[];
  curveTokens: any[];
  spookyTokens: any[];
  joeTokens: any[];
  trisolarisTokens: any[];
  interswapTokens: any[];
}) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.fetchedListPairs({
      pairs,
      pancakeTokens,
      uniTokens,
      curveTokens,
      spookyTokens,
      joeTokens,
      trisolarisTokens,
      interswapTokens,
    }),
  );
};

export const fetchSwapPdexV3 = (swaping: boolean) => {
  StoreService?.current?.dispatch(swapSlice.actions.fetchSwap(swaping));
};

export const setPercentPdexV3 = (percent: number) => {
  StoreService?.current?.dispatch(swapSlice.actions.setPercent(percent));
};

export const resetSwapPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.reset());
};

export const resetDataSwapPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.resetData());
};

export const fetchingSwapPdexV3 = (isFetching: boolean) => {
  StoreService?.current?.dispatch(swapSlice.actions.fetching(isFetching));
};

export const fetchedSwapPdexV3 = (isFetched: boolean) => {
  StoreService?.current?.dispatch(swapSlice.actions.fetched(isFetched));
};

export const changeEstimateDataPdexV3 = (data: any) => {
  StoreService?.current?.dispatch(swapSlice.actions.changeEstimateData(data));
};

export const fetchFailSwapPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.fetchFail());
};

export const setInitingSwapPdexV3 = (initing: boolean) => {
  StoreService?.current?.dispatch(swapSlice.actions.setInitingSwap(initing));
};

export const setSellTokenPdexV3 = (selltoken: string) => {
  StoreService?.current?.dispatch(swapSlice.actions.setSellToken(selltoken));
};

export const setBuyTokenPdexV3 = (buytoken: string) => {
  StoreService?.current?.dispatch(swapSlice.actions.setBuyToken(buytoken));
};

export const setFeeTokenPdexV3 = (feetoken: string) => {
  StoreService?.current?.dispatch(swapSlice.actions.setFeeToken(feetoken));
};

export const setFocusTokenPdexV3 = (focustoken: string) => {
  StoreService?.current?.dispatch(swapSlice.actions.setFocusToken(focustoken));
};

export const setSelectingTokenPdexV3 = (selecting: boolean) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setSelectingToken(selecting),
  );
};

export const setSwapingTokenPdexV3 = (swapingToken: boolean) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setSwapingToken(swapingToken),
  );
};

export const fetchedRewardHistoryPdexV3 = (rewardHistories: any[]) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.fetchedRewardHistory(rewardHistories),
  );
};

export const fetchFailRewardHistoryPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.fetchFailRewardHistory());
};

export const setBestRateExchangePdexV3 = (bestRateExchange: any) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setBestRateExchange(bestRateExchange),
  );
};

export const setExchangeSupportListPdexV3 = (exchangeSupportsList: any[]) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setExchangeSupportList(exchangeSupportsList),
  );
};

export const setResetSlippagePdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.setResetSlippage());
};

export const setEstimateTradeErrorPdexV3 = (estimateTradeError: any) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setEstimateTradeError(estimateTradeError),
  );
};

export const setNavigateFromMarketPdexV3 = (
  isNavigateFromMarketTab: boolean,
) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setNavigateFromMarket(isNavigateFromMarketTab),
  );
};

export const setNavigateToSelectionPdexV3 = (
  isNavigateToSelection: boolean,
) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setNavigateToSelection(isNavigateToSelection),
  );
};

export const resetExchangeSupportedPdexV3 = () => {
  StoreService?.current?.dispatch(swapSlice.actions.resetExchangeSupported());
};

export const saveUnifiedAlertStateByIdPdexV3 = ({
  paymentAddress,
  timeStamp,
  answer,
}: ActionSaveUnifiedAlertStateByIdPayload) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.saveUnifiedAlertStateById({
      paymentAddress,
      timeStamp,
      answer,
    }),
  );
};

export const setEstimateCountPdexV3 = (estimateCount: number) => {
  StoreService?.current?.dispatch(
    swapSlice.actions.setEstimateCount(estimateCount),
  );
};
