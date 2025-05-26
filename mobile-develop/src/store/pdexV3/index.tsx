import {combineReducers} from '@reduxjs/toolkit';
import {homePdexV3Slice} from './homePdexV3';
import {liquiditySlice} from './liquidity';
import {poolsSlice} from './pools';
import {portfolioSlice} from './portforlio';
import {orderLimitSlice} from './oderLimit';
import {swapSlice} from './swap';
import {tradeSlice} from './trade';
import { chartSlice } from './chart';

export const pdexV3Reducer = combineReducers({
  pools: poolsSlice.reducer,
  liquidity: liquiditySlice.reducer,
  portfolio: portfolioSlice.reducer,
  home: homePdexV3Slice.reducer,
  trade: tradeSlice.reducer,
  orderLimit: orderLimitSlice.reducer,
  swap: swapSlice.reducer,
  chart: chartSlice.reducer,
});
