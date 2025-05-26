import { ExHandler } from '@src/services/exception';

import { homePDexV3Selector } from './selectors';
import { fetchedHomePdexV3, fetchFailedHomePdexV3, freeHomePdexV3 } from '.';
import { fetchingHomePdexV3 } from '.';
import getStore from '@src/store/getStore';
import { actionFetchPools } from '../pools/functions';
import { actionFetch as actionFetchListShare } from '../portforlio/functions';

export const actionFetching = () => fetchingHomePdexV3();

export const actionFetched = () => fetchedHomePdexV3();

export const actionFetchFail = () => fetchFailedHomePdexV3();

export const actionFreeHomePDexV3 = () => freeHomePdexV3();

export const actionRefresh = async () => {
  try {
    const state = getStore().getState();
    const { isFetching } = homePDexV3Selector(state);
    if (isFetching) {
      return;
    }
    await actionFetching();
    await Promise.all([
      actionFetchPools(),
      actionFetchListShare(),
    ]);
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    actionFetched();
  }
};
