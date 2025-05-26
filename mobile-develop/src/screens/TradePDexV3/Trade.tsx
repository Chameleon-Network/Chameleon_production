import SelectAccountButton from '@src/components/SelectAccountButton';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import React from 'react';
import { View } from 'react-native';
import OrderLimit from '../OrderLimit';
import { styled } from './Trade.styled';
import Tabs from '@src/components/core/Tabs';
import { ROOT_TAB_TRADE, TAB_BUY_LIMIT_ID, TAB_MARKET_ID, TAB_SELL_LIMIT_ID, TAB_SWAP_ID } from '@src/store/pdexV3/trade/constant';
import { Row } from '@src/components/Row';
import BtnChart from '@src/components/Button/BtnChart';
import { navigateToChart } from '@src/router/NavigationServices';
import Swap from '../Swap/Swap';
import { LoadingContainer } from '@src/components/core';
import { useSelector } from '@src/store/getStore';
import { activedTabSelector } from '@src/store/tabs/selectors';
import { poolsSelector } from '@src/store/pdexV3/pools/selectors';
import { swapInfoSelector } from '@src/store/pdexV3/swap/selectors';
import { actionInitSwapForm } from '@src/store/pdexV3/swap/functions';
import { actionFetchPools } from '@src/store/pdexV3/pools/functions';
import { ExHandler } from '@src/services/exception';
import { resetPools } from '@src/store/pdexV3/pools';
import { resetOderLimitPdexV3 } from '@src/store/pdexV3/oderLimit';
import { resetSwapPdexV3 } from '@src/store/pdexV3/swap';
import { NFTTokenBottomBar } from '../NFTToken';
import { visibleBtnChartSelector } from '@src/store/pdexV3/oderLimit/selectors';
import { actionInit } from '@src/store/pdexV3/oderLimit/functions';


const Trade = () => {
  const visibleBtnChart = useDebounceSelector(visibleBtnChartSelector);
  const [refreshing, setRefreshing] = React.useState(false);
  const { isFetching, isFetched } = useSelector(poolsSelector);
  const activedTab = useSelector(activedTabSelector)(ROOT_TAB_TRADE);
  const swapInfo = useDebounceSelector(swapInfoSelector);

  const onRefresh = async () => {
    try {
      await setRefreshing(true);
      switch (activedTab) {
        case TAB_SWAP_ID: {
          await actionInitSwapForm({
            defaultPair: swapInfo?.defaultPair,
            refresh: true,
            shouldFetchHistory: true,
          });
          break;
        }
        case TAB_SELL_LIMIT_ID:
        case TAB_BUY_LIMIT_ID: {
          await actionInit()
          break;
        }
        case TAB_MARKET_ID: {
          await actionFetchPools()
          break;
        }
        default:
          break;
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setRefreshing(false);
    }
  };
  React.useEffect(() => {
    return () => {
      resetPools();
      // actionResetChart(); //TODO
      resetOderLimitPdexV3();
      resetSwapPdexV3();
    };
  }, []);
  if (isFetching && !isFetched) {
    return <LoadingContainer />;
  }

  return (
    <>
      <View style={styled.container}>
        <Tabs
          rootTabID={ROOT_TAB_TRADE}
          defaultTabHeader
          styledTabs={styled.styledTabs}
          useTab1
          defaultTabIndex={0}
          styledTabList={styled.styledTabList}
          rightCustom={
            <Row style={styled.rightHeader}>
              {visibleBtnChart && (
                <BtnChart
                  onPress={navigateToChart}
                  style={{ marginRight: 15 }}
                />
              )}
              <View>
                <SelectAccountButton handleSelectedAccount={onRefresh} />
              </View>
            </Row>
          }>
          <View tabID={TAB_SWAP_ID} label="Swap">
            <Swap />
          </View>
          <View
            tabID={TAB_BUY_LIMIT_ID}
            label="Buy"
            onChangeTab={() => actionInit(false)}>
            <OrderLimit />
          </View>
          <View
            tabID={TAB_SELL_LIMIT_ID}
            label="Sell"
            onChangeTab={() => actionInit(false)}>
            <OrderLimit />
          </View>
        </Tabs>
      </View>
      {(activedTab === TAB_BUY_LIMIT_ID ||
        activedTab === TAB_SELL_LIMIT_ID) && <NFTTokenBottomBar />}
    </>
  );
};

export default React.memo(Trade)
