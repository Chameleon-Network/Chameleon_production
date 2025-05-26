import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import Modal from '@src/components/Modal';
import TokenFollow from '@src/components/Token/TokenFollow';
import {navigateToTrade} from '@src/router/NavigationServices';
import {ExHandler} from '@src/services/exception';
import {useSelector} from '@src/store/getStore';
import {actionSetPoolSelected} from '@src/store/pdexV3/oderLimit/functions';
import {
  actionInitSwapForm,
  actionNavigateFormMarketTab,
} from '@src/store/pdexV3/swap/functions';
import {ROOT_TAB_TRADE, TAB_SWAP_ID} from '@src/store/pdexV3/trade/constant';
import {MarketTabs} from '@src/store/setting';
import {marketTabSelector} from '@src/store/setting/selectors';
import {actionChangeTab} from '@src/store/tabs/functions';
import {
  actionAddFollowToken,
  actionRemoveFollowToken,
  getPTokenList,
} from '@src/store/token/functions';
import React, {memo, useEffect} from 'react';
import {batch} from 'react-redux';
import {MarketHeader} from './components/Header';
import MarketList from './components/MarketList';

const MarketScreen = memo(() => {
  const refFirstTime = React.useRef(true);
  const fetchData = async () => {
    try {
      if (refFirstTime && refFirstTime.current) {
        refFirstTime.current = false;
        return;
      }
      getPTokenList();
      // dispatch(getInternalTokenList());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const [filter, setFilter] = React.useState({
    filterField: 'change',
    orderField: 'desc',
  });

  const activeTab = useSelector(marketTabSelector);

  const onOrderPress = item => {
    const poolId = item.defaultPoolPair;

    navigateToTrade({tabIndex: 0});
    if (poolId) {
      batch(() => {
        actionSetPoolSelected(poolId);
        actionChangeTab({
          rootTabID: ROOT_TAB_TRADE,
          tabID: TAB_SWAP_ID,
        });
      });
    }
    actionNavigateFormMarketTab(true);
    actionInitSwapForm({
      refresh: true,
      shouldFetchHistory: true,
    });
  };

  const handleToggleFollowToken = async token => {
    try {
      if (!token?.isFollowed) {
        actionAddFollowToken(token?.tokenId);
      } else {
        actionRemoveFollowToken(token?.tokenId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <MarketHeader onFilter={setFilter} />
      <MarketList
        {...filter}
        renderItem={({item}) => (
          <TokenFollow
            showInfo={false}
            item={item}
            key={item.tokenId}
            hideStar={
              activeTab !== MarketTabs.FAVORITE || item.tokenId === PRVIDSTR
            }
            handleToggleFollowToken={handleToggleFollowToken}
            onPress={() => onOrderPress(item)}
          />
        )}
      />
      <Modal />
    </>
  );
});

export default MarketScreen;
