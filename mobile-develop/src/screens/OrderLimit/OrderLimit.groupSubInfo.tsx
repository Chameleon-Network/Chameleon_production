import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { ROOT_TAB_SUB_INFO, TAB_HISTORY_ID, TAB_OPEN_ORDER, TAB_ORDER_BOOK } from '@src/store/pdexV3/oderLimit/constants';
import { openOrdersSelector, orderHistorySelector } from '@src/store/pdexV3/oderLimit/selectors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import History from './OrderLimit.orderHistory';
import Tabs from '@src/components/core/Tabs';
import { OrderBook } from '../Chart/Chart.orderBook';


const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = ({ styleContainer }: { styleContainer: ViewStyle }) => {
  const orderHistory = useDebounceSelector(orderHistorySelector);
  const openOrders = useDebounceSelector(openOrdersSelector);
  return (
    <View style={[styled.container, styleContainer ?? {}]}>
      <Tabs rootTabID={ROOT_TAB_SUB_INFO}>
        <View
          tabID={TAB_ORDER_BOOK}
          label="Order book"
          upperCase={false}
          onChangeTab={() => null}
        >
          <OrderBook />
        </View>
        <View
          tabID={TAB_OPEN_ORDER}
          label="Open orders"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History {...openOrders} />
        </View>
        <View
          tabID={TAB_HISTORY_ID}
          label="History"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History {...orderHistory} />
        </View>
      </Tabs>
    </View>
  );
};

export default React.memo(GroupSubInfo);
