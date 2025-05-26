import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import TabOrderLimitSubError from './OrderLimit.subError';
import { orderLimitDataSelector } from '@src/store/pdexV3/oderLimit/selectors';
import { Hook } from '@src/components/PdexV3/Extra';

const styled = StyleSheet.create({
  container: {},
});

const OrderDetails = () => {
  const orderLimitData = useSelector(orderLimitDataSelector);
  const {
    totalAmountData: { totalStr },
    hideNetworkFee,
    networkfeeAmountStr,
    errorNetworkFee
  } = orderLimitData;

  const factories = [
    {
      label: 'Trading fee',
      value: 'Free',
    },
    {
      label: 'Total',
      value: totalStr,
    },
    hideNetworkFee
      ? undefined
      : {
          label: 'Network Fee',
          value: networkfeeAmountStr,
        },
  ];
  return (
    <View style={styled.container}>
      {factories.map((item) => (
        <Hook {...item} />
      ))}
      {!hideNetworkFee && <TabOrderLimitSubError errorNetworkFee={errorNetworkFee} />}
    </View>
  );
};


export default React.memo(OrderDetails);
