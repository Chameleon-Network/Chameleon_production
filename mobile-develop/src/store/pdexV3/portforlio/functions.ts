import { ExHandler } from '@src/services/exception';
import {batch} from 'react-redux';
import { fetchedPdexV3Portfolio, fetchFailPdexV3Portfolio, fetchingPdexV3Portfolio, freeModalPdexV3Portfolio, setPoolModalPdexV3Portfolio, setShareDetailsPdexV3Portfolio } from '.';
import { portfolioSelector } from './selectors';
import { actionSetNFTTokenData } from '@src/store/account/functions';
import { defaultAccountWalletSelector } from '@src/store/account/selectors';
import { getPDexV3Instance } from '../functions';
import getStore from '@src/store/getStore';


export const actionFetching = () => fetchingPdexV3Portfolio()

export const actionFetched = (payload) => fetchedPdexV3Portfolio(payload)

export const actionFetchFail = () => fetchFailPdexV3Portfolio()

export const actionSetShareDetail = (payload) => setShareDetailsPdexV3Portfolio(payload)

export const actionSetPoolModal = ({ poolId }) => setPoolModalPdexV3Portfolio({poolId})

export const actionFreeModal = () => freeModalPdexV3Portfolio();

export const actionFetch = async () => {
  try {
    const state = getStore().getState();
    const { isFetching } = portfolioSelector(state);
    if (isFetching) {
      return;
    }
    await actionFetching()
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const [listShare] = await Promise.all([
      await pDexV3Inst.getListShare(),
      await actionSetNFTTokenData()
    ]);
    const poolIds = (listShare || []).map(({ poolId }) => poolId);
    let poolDetails = [];
    if (poolIds.length > 0) {
      poolDetails = await pDexV3Inst.getListPoolsDetail(poolIds);
    }
    batch(() => {
      actionSetShareDetail(poolDetails)
      actionFetched(listShare)
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
    await actionFetchFail()
  }
};
