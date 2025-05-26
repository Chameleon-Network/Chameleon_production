import {getPTokenList} from '@src/store/token/functions';
import {fetchedPdexV3Trade, fetchFailPdexV3Trade, fetchingPdexV3Trade} from '.';
import {actionSetNFTTokenData} from '@src/store/account/functions';

export const actionFetching = () => fetchingPdexV3Trade();

export const actionFetched = payload => fetchedPdexV3Trade(payload);

export const actionFetchFail = () => fetchFailPdexV3Trade();

export const actionFetch = async () => {
  try {
    actionFetching();
    const task = [getPTokenList(), actionSetNFTTokenData()];
    await Promise.all(task);
    actionFetched([]);
  } catch (error) {
    actionFetchFail();
  }
};
