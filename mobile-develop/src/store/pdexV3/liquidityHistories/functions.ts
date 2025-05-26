import {batch} from 'react-redux';
import {ExHandler} from '@services/exception';
import {
  setContributeHistories,
  setFetchingContributeHistories,
  setFetchingRemoveHistories,
  setRemoveHistories,
  setWithdrawFeeHistories,
} from '.';
import getStore from '@src/store/getStore';
import {
  isFetchingContribute,
  isFetchingRemoveLP,
  isFetchingWithdrawFeeLP,
} from './selectors';
import {actionGetPDexV3Inst} from '../functions';

export const actionFetchingContribute = ({isFetching}) =>
  setFetchingContributeHistories({isFetching});

export const actionFetchingRemoveLP = ({isFetching}) =>
  setFetchingRemoveHistories({isFetching});

export const actionSetContribute = ({histories}) =>
  setContributeHistories({histories});

export const actionSetRemoveLP = ({histories}) =>
  setRemoveHistories({histories});

export const actionSetWithdrawFeeLP = ({histories}) =>
  setWithdrawFeeHistories({histories});

export const actionGetContributeHistories = async () => {
  try {
    const state = getStore().getState();
    const isFetching = isFetchingContribute(state);
    if (isFetching) return;
    actionFetchingContribute({isFetching: true});
    const pDexV3Inst = await actionGetPDexV3Inst();
    const histories = await pDexV3Inst.getContributeHistories();
    actionSetContribute({histories});
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    actionFetchingContribute({isFetching: false});
  }
};

export const actionGetRemoveLPHistories = async () => {
  try {
    const state = getStore().getState();
    const isFetching = isFetchingRemoveLP(state);
    if (isFetching) return;
    actionFetchingRemoveLP({isFetching: true});
    const pDexV3Inst = await actionGetPDexV3Inst();
    const histories = await pDexV3Inst.getRemoveLPHistories();
    actionSetRemoveLP({histories});
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    actionFetchingRemoveLP({isFetching: false});
  }
};

export const actionGetWithdrawLPHistories = async () => {
  try {
    const state = getStore().getState();
    const isFetching = isFetchingWithdrawFeeLP(state);
    if (isFetching) return;
    actionFetchingRemoveLP({isFetching: true});
    const pDexV3Inst = await actionGetPDexV3Inst();
    const histories = await pDexV3Inst.getWithdrawFeeLPHistories();
    actionSetWithdrawFeeLP({histories});
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    actionFetchingRemoveLP({isFetching: false});
  }
};

export const actionGetHistories = async () => {
  try {
    batch(() => {
      actionGetContributeHistories();
      actionGetRemoveLPHistories();
      actionGetWithdrawLPHistories();
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};
