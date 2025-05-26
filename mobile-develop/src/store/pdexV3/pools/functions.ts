//TODO
import BigNumber from 'bignumber.js';
import { uniqBy } from 'lodash';
import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';
import { batch } from 'react-redux';
import { syncListPools, syncListPoolsFollowing, syncTradingVolume24h } from '.';
import getStore from '@src/store/getStore';
import { getPDexV3Instance } from '../functions';
import { ExHandler } from '@src/services/exception';
import { followPoolIdsSelector } from './selectors';
import { defaultAccountWalletSelector } from '@src/store/account/selectors';


export const requestFetchListPools = async () => {
  try {
    const followIds = getStore().getState().pdexV3.pools.followIds || [];
    const pDexV3Inst = await getPDexV3Instance();
    let pools = (await pDexV3Inst.getListPools('all')) || [];
    const volume = pools.reduce(
      (prev, curr) => new BigNumber(Math.ceil(curr.volume)).plus(prev),
      new BigNumber(0),
    );
    const originalVolume = new BigNumber(volume)
      .multipliedBy(Math.pow(10, 9))
      .toNumber();
    let poolsIDs = pools.map(pool => pool?.poolId) || [];
    poolsIDs = [...followIds, ...poolsIDs];
    poolsIDs = uniq(poolsIDs);
    const priority = {
      // PRV-USDT
      '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-beaa6923ef56ad699dcfed194f9f2eec49846121f79b0d4645093a07c850085a': 4,
      // PRV-BTC
      '0000000000000000000000000000000000000000000000000000000000000004-b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696-b2769c3d130a565027f05f74345760653bfc71200c3df9829e0e931a34f76cb4': 3,
      // PRV-ETH
      '0000000000000000000000000000000000000000000000000000000000000004-3ee31eba6376fc16cadb52c8765f20b6ebff92c0b1c5ab5fc78c8c25703bb19e-407b251bb4a262391cad3fda612f9b0fd5c282ed0624815450a0cfa53410c6ec': 2,
      // PRV-XMR
      '0000000000000000000000000000000000000000000000000000000000000004-c01e7dc1d1aba995c19b257412340b057f8ad1482ccb6a9bb0adce61afbf05d4-dab0cd71061e9dcc3135139e0e982845063933e3bc907b4e179e09f0f25d19e6': 1,
    };
    // sort PRV Pools to the top
    const payload = poolsIDs
      .map(poolId => {
        const pool = pools.find(pool => pool?.poolId === poolId);
        const _priority = priority[pool?.poolId] || 0;
        return {
          ...pool,
          priority: _priority,
        };
      })
      .filter(pool => !!pool);

    let topPools = payload.filter(pool =>
      Object.keys(priority).includes(pool.poolId),
    );
    topPools = orderBy(topPools, 'apy', 'desc');
    const bottomPools = orderBy(payload, 'apy', 'desc');
    const newPools = uniqBy([...topPools, ...bottomPools], 'poolId');
    batch(() => {
      syncListPools(newPools);
      syncTradingVolume24h(originalVolume);
    });
  } catch (error) {
    throw error;
  }
};


export const actionFetchListFollowingPools = async()  => {
  try {
    const state = getStore().getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const followIds = (await pDexV3Inst.getListFollowingPools()) || [];
    await syncListPoolsFollowing({ followIds })
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetchPools = async () => {
  try {
    await actionFetchListFollowingPools();
    await requestFetchListPools();
  } catch (error) {
    console.log('FETCH POOLS ERROR', error);
    new ExHandler(error).showErrorToast();
  }
};

export const actionToggleFollowingPool = async (poolId) => {
  try {
    const state = getStore().getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const followPoolIds = followPoolIdsSelector(state);
    const isFollowed =
      followPoolIds.findIndex((_poolId) => _poolId === poolId) > -1;
    if (isFollowed) {
      await pDexV3Inst.removeFollowingPool({ poolId });
    } else if (!isFollowed) {
      await pDexV3Inst.addFollowingPool({ poolId });
    }
    await actionFetchListFollowingPools();
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};
