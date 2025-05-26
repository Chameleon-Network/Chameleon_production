import {ExHandler} from '@src/services/exception';

import {priceHistorySelector, orderBookSelector} from './selectors';
import {
  changePeriodChartPDexV3,
  fetchedChartPDexV3,
  fetchedOrderBookChartPDexV3,
  fetchedPriceHistoryChartPDexV3,
  fetchFailChartPDexV3,
  fetchingChartPDexV3,
  fetchingPriceHistoryChartPDexV3,
  resetChartPDexV3,
  setSelectedPoolIdChartPDexV3,
} from '.';
import {actionGetPDexV3Inst} from '../functions';
import getStore from '@src/store/getStore';
import {requestFetchListPools} from '../pools/functions';

export const actionReset = () => resetChartPDexV3();

export const actionFetching = () => fetchingChartPDexV3();

export const actionFetched = (payload?: any) => fetchedChartPDexV3(payload);

export const actionFetchFail = () => fetchFailChartPDexV3();

export const actionFetchingPriceHistory = () =>
  fetchingPriceHistoryChartPDexV3();

export const actionFetchedPriceHistory = payload =>
  fetchedPriceHistoryChartPDexV3(payload);

export const actionChangePeriod = payload => changePeriodChartPDexV3(payload);

export const actionFetchPriceHistory = async () => {
  let data = [];
  try {
    const state = getStore().getState();
    const pdexV3Inst = await actionGetPDexV3Inst();
    const {period: periodStr, datapoint, poolid} = priceHistorySelector(state);
    if (!poolid) {
      return;
    }
    await actionFetchingPriceHistory();
    let intervals = '';
    let period = '';
    switch (periodStr) {
      case '15m':
        period = 'PT15M';
        intervals = 'P1D';
        break;
      case '1h':
        period = 'PT1H';
        intervals = 'P3D';
        break;
      case '4h':
        period = 'PT4H';
        intervals = 'P7D';
        break;
      case '1d':
        period = 'P1D';
        intervals = 'P60D';
        break;
      case 'W':
        period = 'P1W';
        intervals = 'P12M';
        break;
      case 'M':
        period = 'P1M';
        intervals = 'P12M';
        break;
      case 'Y':
        period = 'P1M';
        intervals = 'P12M';
        break;
      default:
        break;
    }
    const res =
      (await pdexV3Inst.getPriceHistory({
        poolid,
        period,
        intervals,
      })) || [];
    data = res.slice(0, Math.min(datapoint, res.length));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
  actionFetchedPriceHistory({
    data,
  });
};

export const actionFetchedOrderBook = payload =>
  fetchedOrderBookChartPDexV3(payload);

export const actionFetchOrderBook = async () => {
  let data = [];
  try {
    const state = getStore().getState();
    const pdexV3Inst = await actionGetPDexV3Inst();
    const {poolid} = orderBookSelector(state);
    if (!poolid) {
      return [];
    }
    data = await pdexV3Inst.getPendingOrder({
      poolid,
    });
    data.sell = data.sell || [];
    data.buy = data.buy || [];
    actionFetchedOrderBook(data);
  } catch (error) {
    console.log('error actionFetchOrderBook', error);
    new ExHandler(error).showErrorToast();
  }
  return data;
};

export const actionFetch = async () => {
  try {
    actionFetching();
    await requestFetchListPools();
    actionFetched();
  } catch (error) {
    await actionFetchFail();
  }
};

export const actionSetSelectedPool = payload =>
  setSelectedPoolIdChartPDexV3(payload);
