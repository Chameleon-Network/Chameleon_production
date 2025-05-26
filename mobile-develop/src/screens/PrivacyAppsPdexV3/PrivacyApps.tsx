import { View } from '@src/components/core';
import {
  CurveIcon2,
  JoeIcon2,
  PancakeIcon2,
  SpoonkyIcon2,
  TrisolarisIcon2,
  UniIcon2,
} from '@src/components/Icons';
import { FONTS } from '@src/styles';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import Header from '@src/components/Header/Header';
import { navigateToPrivacyAppsCurve, navigateToPrivacyAppsPancake, navigateToPrivacyAppsSpooky, navigateToPrivacyAppsTraderJoe, navigateToPrivacyAppsTrisolaris, navigateToPrivacyAppsUni } from '@src/router/NavigationServices';
import { KEYS_PLATFORMS_SUPPORTED } from '@src/store/pdexV3/swap/constants';
import { ROOT_TAB_TRADE, TAB_SWAP_ID } from '@src/store/pdexV3/trade/constant';
import { activedTabSelector } from '@src/store/tabs/selectors';
import PrivacyAppsItem from './PrivacyApps.item';
import { useSelector } from '@src/store/getStore';

const styled = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    padding: 20,
  },
  itemSpace: {
    height: 20,
  },
});

const PrivacyApps = () => {
  const getActivedTab = useSelector(activedTabSelector);
  const onPressItem = (id) => {
    switch (id) {
      case KEYS_PLATFORMS_SUPPORTED.pancake:
        navigateToPrivacyAppsPancake();
        break;
      case KEYS_PLATFORMS_SUPPORTED.uni:
      case KEYS_PLATFORMS_SUPPORTED.uniEther:
        navigateToPrivacyAppsUni();
        break;
      case KEYS_PLATFORMS_SUPPORTED.curve:
        navigateToPrivacyAppsCurve();
        break;
      case KEYS_PLATFORMS_SUPPORTED.spooky:
        navigateToPrivacyAppsSpooky();
        break;
      case KEYS_PLATFORMS_SUPPORTED.joe:
        navigateToPrivacyAppsTraderJoe();
        break;
      case KEYS_PLATFORMS_SUPPORTED.trisolaris:
        navigateToPrivacyAppsTrisolaris();
        break;
      default:
        break;
    }
  };
  const factories = React.useMemo(() => {
    return [
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.pancake,
        icon: <PancakeIcon2 />,
        headerTitle: 'pPancake',
        headerSub: 'Private PancakeSwap',
        groupActions: [
          {
            id: 'BSC',
            title: 'Binance Smart Chain',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade anonymously on Binance Smart Chain’s leading DEX. Deep liquidity and super low fees – now with privacy.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.uni,
        icon: <UniIcon2 />,
        headerTitle: 'pUniswap',
        headerSub: 'Private Uniswap',
        groupActions: [
          {
            id: 'POLYGON',
            title: 'Polygon',
          },
          {
            id: 'ETHEREUM',
            title: 'Ethereum',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade confidentially on everyone’s favorite DEX. Faster and cheaper thanks to Polygon, Ethereum, and private like all Incognito apps.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.curve,
        icon: <CurveIcon2 />,
        headerTitle: 'pCurve',
        headerSub: 'Private Curve',
        groupActions: [
          {
            id: 'POLYGON',
            title: 'Polygon',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Swap stablecoins with complete confidentiality using Privacy Curve. Low fees on Polygon meets full privacy on Incognito.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.spooky,
        icon: <SpoonkyIcon2 />,
        headerTitle: 'pSpooky',
        headerSub: 'Private Spooky Swap',
        groupActions: [
          {
            id: 'FANTOM',
            title: 'Fantom',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Explore DeFi on Fantom with full privacy for your activity and assets. Swap Fantom coins anonymously with Private SpookySwap.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.joe,
        icon: <JoeIcon2 />,
        headerTitle: 'pTraderJoe',
        headerSub: 'Private Trader Joe',
        groupActions: [
          {
            id: 'AVALANCHE',
            title: 'Avalanche',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade confidentially on Trader Joe. Faster privacy swap is enabled by fast transaction finality on Avalanche.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.trisolaris,
        icon: <TrisolarisIcon2 />,
        headerTitle: 'pTrisolaris',
        headerSub: 'Private Trisolaris',
        groupActions: [
          {
            id: 'AURORA',
            title: 'Aurora',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Privacy Swap comes to Aurora ecosystem for the first time. Multiple AMMs for best-in-class execution, now with privacy.',
        onPressItem,
      },
    ];
  }, []);

  useFocusEffect(() => {
    const activeTabTrade = getActivedTab(ROOT_TAB_TRADE);
    if (activeTabTrade === TAB_SWAP_ID) {
      // dispatch(
      //   actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }),
      // );
      // Default Buy/Sell Tab when navigate from Apps tab (pApps tab)???!!! (What?)
    }
  });

  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  const renderItem = useCallback(
    ({ item }) => <PrivacyAppsItem {...item} />,
    [],
  );

  const renderItemSeparatorComponent = useCallback(
    () => <View style={styled.itemSpace} />,
    [],
  );

  return (
    <>
      <Header
        title="Privacy apps"
        titleStyled={[{ ...FONTS.TEXT.incognitoH4 }]}
        hideBackButton
      />
      <View borderTop fullFlex>
        <FlatList
          data={factories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparatorComponent}
          contentContainerStyle={styled.flatListContainer}
          initialNumToRender={5}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          windowSize={10}
        />
      </View>
    </>
  );
};


export default React.memo(PrivacyApps)
