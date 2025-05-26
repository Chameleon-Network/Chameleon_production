import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ExHandler} from '@src/services/exception';
import {CONSTANT_CONFIGS} from '@src/constants';
import {orderDetailSelector} from '@src/store/pdexV3/oderLimit/selectors';
import {actionFetchDataOrderDetail} from '@src/store/pdexV3/oderLimit/functions';
import LinkingService from '@src/services/linking';
import {Row} from '@src/components/Row';
import {RefreshControl, Text} from '@src/components/core';
import OrderItem, {
  OrderDetailValue,
  styled as orderItemStyled,
} from '../TradePDexV3/Trade.orderDetail';
import ClipboardService from '@src/services/ClipboardService';
import Header from '@src/components/Header/Header';
import BtnCopy from '@src/components/Button/BtnCopy';
import {ScrollViewBorder} from '@src/components/core/ScrollView';
const styled = StyleSheet.create({
  container: {flex: 1},
});

const OrderDetail = () => {
  const dispatch = useDispatch();
  const {fetching: refreshing, order} = useSelector(orderDetailSelector);
  const onRefresh = async () => {
    dispatch(actionFetchDataOrderDetail());
  };
  const factories = React.useMemo(() => {
    if (!order) {
      return [];
    }
    let ft = [
      {
        label: 'Pool ID',
        value: order?.poolId,
        copiable: true,
      },
      {
        label: 'Request Tx',
        value: `#${order?.requestTx}`,
        copiable: true,
        openUrl: true,
        handleOpenUrl: () =>
          LinkingService.openUrl(
            `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${order?.requestTx}`,
          ),
      },
      {
        label: 'Time',
        value: order?.timeStr,
      },
      {
        label: 'Sell',
        value: order?.sellStr,
      },
      {
        label: 'Buy',
        value: order?.buyStr,
      },
      {
        label: 'Fill',
        value: order?.percentStr1,
      },
      {
        label: 'Status',
        value: order?.statusStr,
      },
      {
        label: 'Rate',
        customValue: order?.rateStr && (
          <Row style={orderItemStyled.rowValue}>
            <Text style={orderItemStyled.value}>{order?.rateStr}</Text>
          </Row>
        ),
      },
      {
        label: 'Network fee',
        value: order?.networkfeeAmountStr,
      },
    ];
    if (order?.respondTxs?.length > 0) {
      ft.push({
        label: 'Response Tx',
        customValue: (
          <Row
            style={{
              ...orderItemStyled.rowValue,
              marginLeft: 0,
              flexDirection: 'column',
            }}>
            {order?.respondTxs.map(responseTx => (
              <OrderDetailValue
                copiable
                openUrl
                handleOpenUrl={() =>
                  LinkingService.openUrl(
                    `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${responseTx}`,
                  )
                }
                value={`#${responseTx}`}
              />
            ))}
          </Row>
        ),
        hookStyled: {
          alignItems: 'flex-start',
        },
        value: order?.respondTxs.map(responseTx => `\n${responseTx}`).join(),
      });
    }
    if (order?.cancelTxId) {
      ft.push({
        label: 'Cancel Tx',
        value: `#${order?.cancelTxId}`,
        copiable: true,
        openUrl: true,
        handleOpenUrl: () =>
          LinkingService.openUrl(
            `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${order?.requestTx}`,
          ),
      });
    }
    return ft.filter(
      ftItem => !!ftItem && (!!ftItem?.value || !!ftItem?.customValue),
    );
  }, [order]);
  const handleCopy = () => {
    try {
      const data = factories
        .map(({label, value}) => `${label}: ${value}`)
        .join('\n');
      ClipboardService.set(data, {copiedMessage: 'Copied', errorMessage: ''});
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    dispatch(actionFetchDataOrderDetail());
  }, []);
  return (
    <View style={styled.container}>
      <Header
        title="Order details"
        rightHeader={<BtnCopy onPress={handleCopy} />}
      />
      <ScrollViewBorder
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {factories.length > 0 &&
          factories?.map(item => <OrderItem key={item?.label} {...item} />)}
      </ScrollViewBorder>
    </View>
  );
};

export default React.memo(OrderDetail);
