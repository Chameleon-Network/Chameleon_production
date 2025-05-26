import React from 'react';
import { View } from 'react-native';
import Header from '@src/components/Header';
import { GroupActions } from '@screens/PDexV3/features/Share';
import { ScrollViewBorder } from '@src/components/core';
import withChart from './Chart.enhance';
import PriceHistoryCandles from './Chart.priceHistoryCandles';
import OrderBook from './Chart.orderBook';
import Details from './Chart.details';
import { styled } from './Chart.styled';

const Chart = ({ onRefresh, callback }) => {
  return (
    <View style={styled.container}>
      <Header title="Chart" />
      <ScrollViewBorder style={styled.scrollview}>
        <GroupActions
          canSelectPool={false}
          onPressRefresh={onRefresh}
          callback={callback}
        />
        <PriceHistoryCandles />
        <Details />
        <OrderBook containerStyled={styled.containerStyled} />
      </ScrollViewBorder>
    </View>
  );
};

Chart.propTypes = {};

export default withChart(React.memo(Chart));
