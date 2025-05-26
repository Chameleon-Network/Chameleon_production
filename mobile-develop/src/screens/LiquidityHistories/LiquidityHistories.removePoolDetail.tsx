import React, {memo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import styled from './LiquidityHistories.styled';
import {View} from '@components/core';
import {useNavigationParam} from '@src/hooks';
import Header from '@src/components/Header/Header';
import {Hook} from '../Wallet/TxHistoryDetail/TxHistoryDetail';
import globalStyled from '@src/theme/theme.styled';
import {COLORS, FONTS} from '@src/styles';

const RemoveLPDetail = () => {
  const history = useNavigationParam('history');
  const hookFactories = React.useMemo(() => {
    const {
      requestTx,
      poolId,
      nftId,
      statusStr,
      timeStr,
      removeData,
      respondTxs,
      statusColor,
    } = history;
    const headHook = [
      {
        label: 'PoolID',
        valueText: poolId,
        copyable: true,
      },
      {
        label: 'TicketID',
        valueText: nftId,
        copyable: true,
      },
      {
        label: 'TxID',
        valueText: requestTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          // openLink({ txID: requestTx }) //TODO
        },
      },
      {
        label: 'Status',
        valueText: statusStr,
        rightColor: statusColor,
      },
      {
        label: 'Time',
        valueText: timeStr,
      },
    ];
    const responseHook = (respondTxs || []).map(txID => ({
      label: 'Response',
      valueText: txID,
      copyable: true,
      openUrl: true,
      handleOpenLink: () => {
        // openLink({ txID: txID }); //TODO
      },
    }));
    const amountHook = removeData.map(
      ({removeAmountSymbolStr: amount, removeAmount}, index) => ({
        label: `Amount ${index + 1}`,
        valueText: amount,
        disabled: !removeAmount,
      }),
    );
    return [...headHook, ...responseHook, ...amountHook];
  }, [history]);
  return (
    <>
      <Header title="Detail" />
      <View borderTop style={mainStyle.container}>
        <ScrollView>
          {hookFactories.map(data => (
            <Hook
              key={data?.label}
              {...data}
              labelStyle={styled.leftText}
              valueTextStyle={[
                styled.rightText,
                !!data.rightColor && {color: data?.rightColor},
              ]}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default memo(RemoveLPDetail);

const mainStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flex: 1,
  },
  fullFlex: {
    flex: 1,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
    height: 50,
    borderRadius: 8,
  },
  scrollView: {
    marginBottom: 70,
  },
  mainInfo: {
    marginVertical: 20,
  },
  bigText: {
    ...FONTS.STYLE.bold,
    color: COLORS.colorTradeBlue,
    fontSize: 35,
    lineHeight: 45,
  },
  error: {
    color: COLORS.red,
    lineHeight: 22,
  },
  extra: {
    marginTop: 25,
  },
  tab1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...globalStyled.defaultPaddingHorizontal,
    paddingBottom: 16,
  },
  styledTabList1: {},
});
