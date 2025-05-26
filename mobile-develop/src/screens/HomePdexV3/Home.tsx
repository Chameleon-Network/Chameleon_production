import {SearchIcon} from '@components/Icons';
import {Text, TouchableOpacity} from '@src/components/core';
import {Row} from '@src/components/Row';
import useDebounceSelector from '@src/hooks/useDebounceSelector';
import {
  navigateToContributePool,
  navigateToPoolsTab,
} from '@src/router/NavigationServices';
import {defaultAccountSelector} from '@src/store/account/selectors';
import {useSelector} from '@src/store/getStore';
import {
  ROOT_TAB_HOME,
  TAB_POOLS_ID,
  TAB_PORTFOLIO_ID,
  TAB_REWARDS_ID,
} from '@src/store/pdexV3/homePdexV3/constants';
import {
  actionFreeHomePDexV3,
  actionRefresh,
} from '@src/store/pdexV3/homePdexV3/functions';
import {actionSetContributeID} from '@src/store/pdexV3/liquidity/functions';
import {listPoolsSelector} from '@src/store/pdexV3/pools/selectors';
import {COLORS, FONTS, FontStyle} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {batch} from 'react-redux';
import PoolsList, {PoolsListHeader} from '../Pools/Pools.list';
import {PoolReward, ReturnLP} from '../Share';
import Tabs from '@src/components/core/Tabs/Tabs';
import SelectAccountButton from '@src/components/SelectAccountButton';
import Portfolio from '../Portfolio';
import PortfolioReward from '../Portfolio/Portfolio.reward';

const TabPools = React.memo(() => {
  const listPools = (useDebounceSelector(listPoolsSelector) || []).filter(
    ({token1, token2}) =>
      !token1.movedUnifiedToken && !token2.movedUnifiedToken,
  );
  const onNavigateContribute = poolId => {
    batch(() => {
      actionSetContributeID({poolId, nftId: ''});
      navigateToContributePool();
    });
  };
  return (
    <>
      <PoolsListHeader />
      <PoolsList
        onPressPool={onNavigateContribute}
        listPools={listPools}
        canSearch={false}
      />
      <TouchableOpacity
        style={styled.btnSearchPool}
        onPress={navigateToPoolsTab}>
        <Text style={styled.text}>Search for other pools</Text>
        <View style={{marginLeft: 8}}>
          <SearchIcon size={16} />
        </View>
      </TouchableOpacity>
    </>
  );
});

const HeaderPortfolioView = React.memo(() => {
  const renderContent = () => (
    <View style={globalStyled.defaultPaddingHorizontal}>
      <Row spaceBetween style={styled.headerRow}>
        <ReturnLP />
      </Row>
    </View>
  );
  return renderContent();
});

const HeaderRewardView = React.memo(() => {
  const renderContent = () => (
    <View style={globalStyled.defaultPaddingHorizontal}>
      <Row spaceBetween style={styled.headerRow}>
        <PoolReward />
      </Row>
    </View>
  );
  return renderContent();
});

const Home = () => {
  const account = useSelector(defaultAccountSelector);
  const handleOnRefresh = () => actionRefresh();

  useEffect(() => {
    handleOnRefresh();
    return () => {
      actionFreeHomePDexV3();
    };
  }, [account.paymentAddress]);

  const _TabPools = React.useMemo(
    () => (
      <View key={TAB_POOLS_ID} label="Pools">
        <TabPools />
      </View>
    ),
    [],
  );
  const _TabPortfolio = React.useMemo(
    () => (
      <View key={TAB_PORTFOLIO_ID} label="Portfolio">
        <HeaderPortfolioView />
        <Portfolio />
      </View>
    ),
    [],
  );
  const _TabReward = React.useMemo(
    () => (
      <View key={TAB_REWARDS_ID} label="Rewards">
        <HeaderRewardView />
        <PortfolioReward />
      </View>
    ),
    [],
  );

  return (
    <Tabs
      rootTabID={ROOT_TAB_HOME}
      useTab1
      defaultTabHeader
      styledTabs={{marginTop: 12}}
      rightCustom={<SelectAccountButton />}>
      {_TabPools}
      {_TabPortfolio}
      {_TabReward}
    </Tabs>
  );
};

export default React.memo(Home);

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    paddingTop: 32,
    flex: 1,
  },
  groupBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tradeBtn: {
    width: 115,
    maxWidth: '48%',
  },
  createNewPoolBtn: {
    width: '100%',
  },
  headerRow: {
    marginTop: 32,
  },
  tab: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLORS.colorGrey2,
    borderBottomWidth: 1,
  },
  styledTabList: {
    borderBottomWidth: 0,
  },
  title: {
    ...FontStyle.medium,
    color: COLORS.white,
  },
  disabledText: {
    ...FontStyle.medium,
    color: COLORS.lightGrey31,
  },
  tabEnable: {
    backgroundColor: COLORS.colorBlue,
  },
  text: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
  },
  btnSearchPool: {
    ...globalStyled.defaultPaddingHorizontal,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
