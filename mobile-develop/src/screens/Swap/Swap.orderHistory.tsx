import {Text, TouchableOpacity, View} from '@src/components/core';
import {Row} from '@src/components/Row';
import {navigateToOrderSwapDetail} from '@src/router/NavigationServices';
import {useSelector} from '@src/store/getStore';
import {actionFetchedOrderDetail} from '@src/store/pdexV3/swap/functions';
import {swapHistorySelector} from '@src/store/pdexV3/swap/selectors';
import {FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Divider} from 'react-native-elements';
import {useTheme} from 'styled-components/native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  order: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  orderId: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 5,
    maxWidth: 200,
  },
  swap: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 5,
    marginRight: 15,
    flex: 1,
  },
  statusStr: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
  },
  wrapperOrder: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
  },
});

const Order = React.memo(({data}) => {
  const theme = useTheme();
  if (!data?.requestBurnTxInc) {
    return null;
  }
  const {
    statusStr,
    swapStr,
    requestBurnTxInc,
    exchange,
    color: statusColor,
  } = data;

  const handleNavOrderDetail = async () => {
    actionFetchedOrderDetail(data);
    navigateToOrderSwapDetail();
  };

  return (
    <>
      <TouchableOpacity style={styled.order} onPress={handleNavOrderDetail}>
        <View style={styled.wrapperOrder}>
          <Row style={{...styled.row, marginBottom: 4}}>
            <Text style={[styled.swap]}>{swapStr}</Text>
            <Text style={[styled.statusStr, {color: statusColor}]}>
              {statusStr}
            </Text>
          </Row>
          <Row style={styled.row}>
            <Text
              style={[styled.orderId, {color: theme.subText}]}
              numberOfLines={1}
              ellipsizeMode="middle">
              {`#${requestBurnTxInc}`}
            </Text>
            <Text style={[styled.title, {color: theme.subText}]}>
              {exchange}
            </Text>
          </Row>
        </View>
      </TouchableOpacity>
    </>
  );
});

interface OrderHistoryProps {
  page?: number;
}

const OrderHistory = ({page}: OrderHistoryProps) => {
  const {history = []} = useSelector(swapHistorySelector)();

  const historyDisplay = React.useMemo(() => {
    if (!page) return [];
    return history.slice(0, page);
  }, [page, history]);

  const renderItem = React.useCallback((item, index) => {
    return (
      <View key={item?.requestBurnTxInc}>
        <Order data={item} visibleDivider={index !== history.length - 1} />
        {index !== history.length - 1 && <Divider />}
      </View>
    );
  }, []);
  return <View style={styled.container}>{historyDisplay.map(renderItem)}</View>;
};

export default React.memo(OrderHistory);
