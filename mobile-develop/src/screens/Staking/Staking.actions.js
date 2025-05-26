import TYPES from '@screens/PDexV3/features/Staking/Staking.constant';
import {actionGetPDexV3Inst} from '@screens/PDexV3';
import {ExHandler} from '@services/exception';
import {getBalance} from '@src/redux/actions/token';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import {batch} from 'react-redux';
import uniq from 'lodash/uniq';
import {stakingSelector} from '@screens/PDexV3/features/Staking';
import {actionSetNFTTokenData} from '@src/redux/actions/account';

const actionFetching = ({ isFetching }) => ({
  type: TYPES.ACTION_FETCHING,
  payload: { isFetching }
});

const actionUpdateData = (payload) => ({
  type: TYPES.ACTION_UPDATE_DATA,
  payload,
});

const actionGetBalances = (tokenIDs) => async (dispatch) => {
  try {
    if (!tokenIDs.includes(PRVIDSTR)) {
      tokenIDs.push(PRVIDSTR);
    }
    tokenIDs.forEach((tokenId) => {
      dispatch(getBalance(tokenId));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

const actionFetchCoins = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const isFetching = stakingSelector.isFetchingCoinsSelector(state);
    if (isFetching) return;
    batch(() => {
      dispatch(actionFetching({ isFetching: true }));
      dispatch(actionSetNFTTokenData());
    });
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const data = (await pDexV3Inst.getStakingData()) || [];
    const tokenIDs = uniq((data || []).map(({ tokenId }) => tokenId));
    batch(() => {
      dispatch(actionGetBalances(tokenIDs));
      dispatch(actionUpdateData(data));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionFetching({ isFetching: false }));
  }
};

const actionSetInvestCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_INVEST_COIN,
  payload: { tokenID }
});

const actionSetWithdrawInvestCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_INVEST_COIN,
  payload: { tokenID }
});

const actionSetWithdrawRewardCoin = ({ tokenID }) => ({
  type: TYPES.ACTION_SET_WITHDRAW_REWARD_COIN,
  payload: { tokenID }
});

const actionChangeAccount = () => ({
  type: TYPES.ACTION_FREE_STAKING,
});

const actionUpdateFetchingHistories = () => ({
  type: TYPES.ACTION_FETCHING_HISTORIES,
});

const actionUpdateFetchedHistories = () => ({
  type: TYPES.ACTION_FETCHED_HISTORIES,
});

const actionUpdateHistories = ({ histories, key }) => ({
  type: TYPES.ACTION_UPDATE_HISTORIES,
  payload: { histories, key }
});

const actionSetHistoriesKey = ({ tokenID, nftID }) => ({
  type: TYPES.ACTION_SET_HISTORIES_KEY,
  payload: { tokenID, nftID }
});

const actionFetchHistories = () => async (dispatch, getState) => {
  const state = getState(getState);
  const { isFetching, isLoadMore } = stakingSelector.stakingHistoriesStatus(state);
  if (isFetching || isLoadMore) return;
  try {
    dispatch(actionUpdateFetchingHistories());
    const { tokenID, nftID, key } = stakingSelector.stakingHistoriesKeySelector(state);
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const histories = (await pDexV3Inst.getStakingHistories({ tokenID, nftID })) || [];
    dispatch(actionUpdateHistories({ histories, key }));
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionUpdateFetchedHistories());
  }
};

const actionUpdateFetchingPool = ({ isFetching }) => ({
  type: TYPES.ACTION_UPDATE_FETCHING_POOL,
  payload: { isFetching }
});

const actionSetStakingPools = ({ pools }) => ({
  type: TYPES.ACTION_SET_POOL,
  payload: { pools }
});

const actionFetchStakingPools = () => async (dispatch, getState) => {
  const state = getState(getState);
  const isFetching = stakingSelector.isFetchingPoolSelector(state);
  if (isFetching) return;
  try {
    batch(() => {
      dispatch(actionUpdateFetchingPool({ isFetching: true }));
      dispatch(actionSetNFTTokenData());
    });
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    const pools = (await pDexV3Inst.getStakingPool()) || [];
    const tokenIds = pools.map(({ tokenId }) => tokenId);
    batch(() => {
      dispatch(actionSetStakingPools({ pools }));
      dispatch(actionGetBalances([...tokenIds, PRVIDSTR]));
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    dispatch(actionUpdateFetchingPool({ isFetching: false }));
  }
};


export default ({
  actionFetchCoins,
  actionSetInvestCoin,
  actionSetWithdrawInvestCoin,
  actionSetWithdrawRewardCoin,
  actionChangeAccount,
  actionSetHistoriesKey,
  actionFetchHistories,
  actionFetchStakingPools,
  actionGetBalances,
});
