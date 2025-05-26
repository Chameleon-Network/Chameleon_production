/* eslint-disable import/no-cycle */
import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { ExHandler } from '@src/services/exception';
import { PrivacyVersion } from 'incognito-chain-web-js/build/wallet';

import { actionSetNFTTokenData as actionSetNFTTokenDataNoCache } from '@src/store/account/functions';
import { nftTokenDataSelector } from '@src/store/account/selectors';
import getStore from '@src/store/getStore';
import { activedTabSelector } from '@src/store/tabs/selectors';
import { getBalance } from '@src/store/token/functions';
import { differenceBy, orderBy } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { batch } from 'react-redux';
import { change, focus, reset } from 'redux-form';
import { fetchedOderLimitPdexV3, fetchedOpenOrdersOderLimitPdexV3, fetchedOrderDetailOderLimitPdexV3, fetchedOrdersHistoryOderLimitPdexV3, fetchedWithdrawingOrderTxsOderLimitPdexV3, fetchFailOderLimitPdexV3, fetchFailOrdersHistoryOderLimitPdexV3, fetchingOderLimitPdexV3, fetchingOrderDetailOderLimitPdexV3, fetchingOrdersHistoryOderLimitPdexV3, fetchOrderingOderLimitPdexV3, resetOderLimitPdexV3, resetOrdersHistoryOderLimitPdexV3, setBuyTokenOderLimitPdexV3, setFeeTokenOderLimitPdexV3, setInitingOderLimitPdexV3, setPercentOderLimitPdexV3, setPoolIdOderLimitPdexV3, setSellTokenOderLimitPdexV3, withdrawingOrderOderLimitPdexV3 } from '.';
import { actionGetPDexV3Inst } from '../functions';
import { actionFetchPools } from '../pools/functions';
import { defaultPoolSelector, getAllTokenIDsInPoolsSelector, listPoolsIDsSelector } from '../pools/selectors';
import { actionSetDefaultPair } from '../swap/functions';
import { ROOT_TAB_TRADE, TAB_BUY_LIMIT_ID, TAB_SELL_LIMIT_ID } from '../trade/constant';
import { formConfigs, HISTORY_ORDERS_STATE, OPEN_ORDERS_STATE, ROOT_TAB_SUB_INFO } from './constants';
import { buyInputAmountSelector, orderDetailSelector, orderLimitDataSelector, poolSelectedDataSelector, rateDataSelector, sellInputAmountSelector } from './selectors';

export const actionResetOrdersHistory = (
  payload = { field: HISTORY_ORDERS_STATE }
) => resetOrdersHistoryOderLimitPdexV3(payload)

export const actionSetPercent = (payload: number) => setPercentOderLimitPdexV3(payload);

export const actionFetching = () => fetchingOderLimitPdexV3();

export const actionFetched = () => fetchedOderLimitPdexV3();

export const actionFetchFail = () => fetchFailOderLimitPdexV3();

export const actionReset = () => resetOderLimitPdexV3();

export const actionSetFeeToken = (payload: string) => setFeeTokenOderLimitPdexV3(payload);

export const actionIniting = (payload: boolean) => setInitingOderLimitPdexV3(payload);

export const actionSetSellTokenFetched = (payload: string) => setSellTokenOderLimitPdexV3(payload);

export const actionSetBuyTokenFetched = (payload: string) => setBuyTokenOderLimitPdexV3(payload);

export const actionSetPoolSelected = async (payload: string) => {
  batch(async () => {
    actionResetOrdersHistory()
    setPoolIdOderLimitPdexV3(payload)
    actionSetDefaultPool()
  });
};

export const actionSetSellToken =
  async (selltokenId, refresh) => {
    try {
      if (!selltokenId) {
        return;
      }
      if (refresh) {
        getBalance(selltokenId);
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  }; 3.
0.


export const actionSetBuyToken = async (buytokenId, refresh) => {
  try {
    if (!buytokenId) {
      return;
    }
    batch(() => {
      if (refresh) {
        getBalance(buytokenId)
      }
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetInputToken =
  async ({ selltoken, buytoken, refresh }) => {
    if (!selltoken || !buytoken) {
      return;
    }
    try {
      batch(() => {
        actionSetSellToken(selltoken, refresh)
        actionSetBuyToken(buytoken, refresh)
        if (selltoken !== PRV.id && buytoken !== PRV.id && refresh) {
          getBalance(PRV.id)
        }
      });
    } catch (error) {
      throw error;
    }
  };
export const actionSetDefaultPool = async () => {
  try {
    const pDexV3Inst = await actionGetPDexV3Inst();
    const state = getStore().getState();
    const pool = poolSelectedDataSelector(state);
    if (!pool) {
      return;
    }
    const { token1, token2 } = pool;
    pDexV3Inst.setDefaultPool(pool?.poolId);
    const defaultPair = {
      selltoken: token1?.tokenId,
      buytoken: token2?.tokenId,
    };
    actionSetDefaultPair(defaultPair);
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionInit = async (refresh = true) => {
  try {
    actionFetching()
    if (refresh) {
      //TODO
      reset(formConfigs.formName)
    }
    const state = getStore().getState();
    const pools = listPoolsIDsSelector(state);
    const poolSelected = poolSelectedDataSelector(state);
    if (!poolSelected?.poolId) {
      const pDexV3Inst = await actionGetPDexV3Inst();
      let defaultPoolId;
      try {
        defaultPoolId = await pDexV3Inst.getDefaultPool();
      } catch {
        //
      }
      const isValidPool =
        pools?.findIndex((poolId) => poolId === defaultPoolId) > -1;
      if (!defaultPoolId || !isValidPool) {
        defaultPoolId = defaultPoolSelector(state);
        await actionSetDefaultPool();
      }
      await actionSetPoolSelected(defaultPoolId)
    }
    state = getStore().getState();
    const pool = poolSelectedDataSelector(state);
    if (isEmpty(pool)) {
      return;
    }
    const activedTab = activedTabSelector(state)(ROOT_TAB_TRADE);
    const token1: SelectedPrivacy = pool?.token1;
    const token2: SelectedPrivacy = pool?.token2;
    let selltokenId, buytokenId;
    switch (activedTab) {
      case TAB_BUY_LIMIT_ID: {
        buytokenId = token1.tokenId;
        selltokenId = token2.tokenId;
        break;
      }
      case TAB_SELL_LIMIT_ID: {
        selltokenId = token1.tokenId;
        buytokenId = token2.tokenId;
        break;
      }
      default:
        break;
    }
    batch(() => {
      actionSetBuyTokenFetched(buytokenId);
      actionSetSellTokenFetched(selltokenId);
      actionSetPercent(0);
      actionSetInputToken({
        selltoken: selltokenId,
        buytoken: buytokenId,
        refresh,
      })
      state = getStore().getState();
      const { rate } = rateDataSelector(state);
      change(formConfigs.formName, formConfigs.rate, rate);
      focus(formConfigs.formName, formConfigs.rate);
      actionFetchPools();
    });
    if (refresh) {
      await actionSetNFTTokenDataNoCache()
    }
  } catch (error) {
    new ExHandler(error).showErrorToast;
  } finally {
    actionFetched()
  }
};

export const actionFetchedOpenOrders = (payload) => fetchedOpenOrdersOderLimitPdexV3(payload)

export const actionFetchedWithdrawingOrderTxs = (payload) => fetchedWithdrawingOrderTxsOderLimitPdexV3(payload)

export const actionFetchWithdrawOrderTxs = async () => {
  let withdrawTxs = [];
  try {
    const state = getStore().getState();
    const pDexV3Inst = await actionGetPDexV3Inst();
    const poolIds = listPoolsIDsSelector(state);
    withdrawTxs = await pDexV3Inst.getWithdrawOrderTxs({
      poolIds,
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await actionFetchedWithdrawingOrderTxs(withdrawTxs);
  }
};

export const actionFetchingOrdersHistory = (payload) => fetchingOrdersHistoryOderLimitPdexV3(payload)

export const actionFetchedOrdersHistory = (payload) => fetchedOrdersHistoryOderLimitPdexV3(payload)

export const actionFetchFailOrderHistory = (payload) => fetchFailOrdersHistoryOderLimitPdexV3(payload)

export const actionFetchOrdersHistory =
  async (field) => {
    let data = [];
    try {
      const state = getStore().getState();
      const pool = poolSelectedDataSelector(state);
      const activedTab = activedTabSelector(state)(ROOT_TAB_SUB_INFO);
      if (!pool || !field || field !== activedTab) {
        return;
      }
      await actionFetchingOrdersHistory({ field });
      const pDexV3Inst = await actionGetPDexV3Inst();
      const nftData = nftTokenDataSelector(state);
      let listNFTToken = nftData?.listNFTToken;
      if (!listNFTToken || listNFTToken?.length === 0) {
        const data = await actionSetNFTTokenDataNoCache();
        listNFTToken = [...data?.listNFTToken];
      }
      switch (field) {
        case OPEN_ORDERS_STATE: {
          const tokenIds = getAllTokenIDsInPoolsSelector(state);
          let [orderFromStorage, openOrders] = await Promise.all([
            pDexV3Inst.getOrderLimitHistoryFromStorage({
              tokenIds,
              version: PrivacyVersion.ver2,
            }),
            pDexV3Inst.getOpenOrderLimitHistoryFromApi({
              version: PrivacyVersion.ver2,
              listNFTToken,
            }),
          ]);
          openOrders = openOrders.map((order) => ({
            ...order,
            requestime: order?.requestime * 1000,
          }));
          orderFromStorage = differenceBy(
            orderFromStorage,
            openOrders,
            (h) => h?.requestTx,
          );
          openOrders = [...orderFromStorage, ...openOrders];
          openOrders = orderBy(openOrders, 'requestime', 'desc');
          data = [...openOrders];
          break;
        }
        case HISTORY_ORDERS_STATE: {
          data =
            (await pDexV3Inst.getOrderLimitHistoryFromApi({
              poolid: pool?.poolId,
              version: PrivacyVersion.ver2,
              listNFTToken,
            })) || [];
          data = data.map((order) => ({
            ...order,
            requestime: order?.requestime * 1000,
          }));
          break;
        }
        default:
          break;
      }
      const currentPoolID = pool?.poolId;
      data = data.filter(item => item.poolId === currentPoolID) || [];

      await actionFetchWithdrawOrderTxs();
      await actionFetchedOrdersHistory({ field, data });
    } catch (error) {
      await actionFetchFailOrderHistory({ field });
      new ExHandler(error).showErrorToast();
    }
  };

export const actionWithdrawingOrder = (payload) => withdrawingOrderOderLimitPdexV3(payload)

export const actionWithdrawOrder =
  async ({ requestTx, txType, nftid, poolId: poolid, token1ID, token2ID, type, minAccept }) => {
    try {
      const state = getStore().getState();
      const pDexV3Inst = await actionGetPDexV3Inst();
      if (!requestTx || !poolid) {
        return;
      }
      await actionWithdrawingOrder(requestTx);
      const data = {
        withdrawTokenIDs: [token1ID, token2ID],
        poolPairID: poolid,
        orderID: requestTx,
        amount: '0',
        version: PrivacyVersion.ver2,
        txType,
        nftID: nftid,
        callback: async (tx) => {
          await Promise.all([
            actionFetchWithdrawOrderTxs(),
            actionSetNFTTokenDataNoCache(),
          ]);
        },
      };
      //TODO: DO LATER
      // setTimeout(() => {
      //   requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.CANCEL_ORDER, {
      //     token_id1: token1ID,
      //     token_id2: token2ID,
      //     type,
      //     min_accept: minAccept
      //   });
      // }, 300);
      await pDexV3Inst.createAndSendWithdrawOrderRequestTx({ extra: data });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await actionWithdrawingOrder(requestTx)
    }
  };

export const actionFetchingBookOrder = (payload) => fetchOrderingOderLimitPdexV3(payload)

export const actionBookOrder = async () =>  {
  await actionFetchingBookOrder(true);
  try {
    const state = getStore().getState();
    const { disabledBtn, activedTab, totalAmountData } =
      orderLimitDataSelector(state);
    if (disabledBtn) {
      return;
    }
    const { totalAmountToken, totalOriginalAmount } = totalAmountData;
    //TODO: DO LATER
    // setTimeout(() => {
    //   dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.ORDER));
    // }, 300);
    const pDexV3Inst = await actionGetPDexV3Inst();
    const { poolId: poolPairID } = poolSelectedDataSelector(state);
    let extra;
    switch (activedTab) {
      case TAB_BUY_LIMIT_ID: {
        const { originalAmount: minAcceptableAmount, tokenData } =
          buyInputAmountSelector(state);
        const sellToken: SelectedPrivacy = totalAmountToken;
        const buyToken: SelectedPrivacy = tokenData;
        const tokenIDToSell = sellToken?.tokenId;
        const sellAmount = totalOriginalAmount;
        const tokenIDToBuy = buyToken?.tokenId;
        extra = {
          tokenIDToSell,
          poolPairID,
          sellAmount: String(sellAmount),
          version: PrivacyVersion.ver2,
          minAcceptableAmount: String(minAcceptableAmount),
          tokenIDToBuy,
        };
        break;
      }
      case TAB_SELL_LIMIT_ID: {
        const { originalAmount: sellAmount, tokenData } =
          sellInputAmountSelector(state);
        const sellToken: SelectedPrivacy = tokenData;
        const buyToken: SelectedPrivacy = totalAmountToken;
        const tokenIDToSell = sellToken?.tokenId;
        const minAcceptableAmount = totalOriginalAmount;
        const tokenIDToBuy = buyToken?.tokenId;
        extra = {
          tokenIDToSell,
          poolPairID,
          sellAmount: String(sellAmount),
          version: PrivacyVersion.ver2,
          minAcceptableAmount: String(minAcceptableAmount),
          tokenIDToBuy,
        };
        break;
      }
      default:
        break;
    }
    const tx = await pDexV3Inst.createAndSendOrderRequestTx({ extra });
    actionSetNFTTokenDataNoCache();
    actionFetchOrdersHistory(OPEN_ORDERS_STATE);
    return tx;
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await actionFetchingBookOrder(false);
  }
};

export const actionFetchingOrderDetail = () => fetchingOrderDetailOderLimitPdexV3()

export const actionFetchedOrderDetail = (payload) => fetchedOrderDetailOderLimitPdexV3(payload)

export const actionFetchDataOrderDetail = async () => {
  let _order = {};
  const state = getStore().getState();
  const { order } = orderDetailSelector(state);
  const pool = poolSelectedDataSelector(state);
  if (!order?.requestTx || !pool) {
    return;
  }
  const { poolId, token1Id, token2Id } = pool;
  try {
    const { requestTx, fromStorage } = order;
    await actionFetchingOrderDetail();
    const pDexV3 = await actionGetPDexV3Inst();
    const params = {
      requestTx,
      poolid: poolId,
      token1ID: token1Id,
      token2ID: token2Id,
      fromStorage: !!fromStorage,
      version: PrivacyVersion.ver2,
    };
    _order = await pDexV3.getOrderLimitDetail(params);
    _order = {
      ..._order,
      requestime: fromStorage ? _order?.requestime : _order?.requestime * 1000,
    };
  } catch (error) {
    _order = { ...order };
    new ExHandler(error).showErrorToast();
  } finally {
    _order = _order || order;
    await actionFetchWithdrawOrderTxs();
    await actionSetNFTTokenDataNoCache();
    await actionFetchedOrderDetail(_order);
  }
};
