import { Text } from '@src/components/core';
import Tabs from '@src/components/core/Tabs';
import { Row } from '@src/components/Row';
import { useSelector } from '@src/store/getStore';
import { actionFetchOrderBook } from '@src/store/pdexV3/chart/functions';
import { orderBookSelector } from '@src/store/pdexV3/chart/selectors';
import { ROOT_TAB_SUB_INFO, TAB_ORDER_BOOK } from '@src/store/pdexV3/oderLimit/constants';
import { COLORS, FONTS } from '@src/styles';
import React, { memo, useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { v4 } from 'uuid';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  price: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    color: COLORS.black,
  },
  volume: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
  },
  label: {
    fontSize: FONTS.SIZE.superSmall,
    color: COLORS.colorGrey3,
  },
  wrapperOrder: {
    flex: 1,
    maxWidth: '49%',
  },
  wrapperItem: { justifyContent: 'space-between', marginBottom: 15 },
});

const Item = memo((props) => {
  const { priceStr, volumeStr, color, isBuy, isSell, isLabel } = props;
  if (isBuy) {
    if (isLabel) {
      return (
        <Row style={styled.wrapperItem}>
          <Text numberOfLines={1} style={{ ...styled.volume, ...styled.label }}>
            Amount
          </Text>
          <Text numberOfLines={1} style={{ ...styled.price, ...styled.label }}>
            Price
          </Text>
        </Row>
      );
    }
    return (
      <Row style={styled.wrapperItem}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ ...styled.volume }}
        >
          {volumeStr}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ ...styled.price, color }}
        >
          {priceStr}
        </Text>
      </Row>
    );
  }
  if (isSell) {
    if (isLabel) {
      return (
        <Row style={styled.wrapperItem}>
          <Text numberOfLines={1} style={{ ...styled.price, ...styled.label }}>
            Price
          </Text>
          <Text numberOfLines={1} style={{ ...styled.volume, ...styled.label }}>
            Amount
          </Text>
        </Row>
      );
    }
    return (
      <Row style={styled.wrapperItem}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ ...styled.price, color }}
        >
          {priceStr}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ ...styled.volume }}
        >
          {volumeStr}
        </Text>
      </Row>
    );
  }
  return null;
});

export const OrderBook = memo(() => {
  const orderBook = useSelector(orderBookSelector);
  const { buy, sell, poolid } = orderBook;
  const fetchData = useCallback(() => {
    actionFetchOrderBook()
  }, []);
  React.useEffect(() => {
    fetchData();
  }, [poolid]);
  if (!poolid) {
    return null;
  }
  return (
    <View style={styled.wrapper}>
      <View style={styled.wrapperOrder}>
        <Item isBuy isLabel />
        {buy.map((o) => (
          <Item {...o} key={o?.txRequest || v4()} isBuy />
        ))}
      </View>
      <View style={styled.wrapperOrder}>
        <Item isSell isLabel />
        {sell.map((o) => (
          <Item {...o} key={o?.txRequest || v4()} isSell />
        ))}
      </View>
    </View>
  );
});

interface OrderBookContainerProps {
  containerStyled: ViewStyle;
}

const OrderBookContainer = ({ containerStyled }: OrderBookContainerProps) => {
  return (
    <View style={[styled.container, containerStyled]}>
      <Tabs rootTabID={ROOT_TAB_SUB_INFO}>
        <View
          tabID={TAB_ORDER_BOOK}
          label="Order book"
          upperCase={false}
          onChangeTab={() => null}
        >
          <OrderBook />
        </View>
        <View tabID="" label="" />
      </Tabs>
    </View>
  );
};

export default React.memo(OrderBookContainer);
