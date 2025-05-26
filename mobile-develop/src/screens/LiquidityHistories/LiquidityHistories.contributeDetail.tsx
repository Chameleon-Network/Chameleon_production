import React, {memo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import flatten from 'lodash/flatten';
import linkingService from '@services/linking';
import {CONSTANT_CONFIGS} from '@src/constants';
import withContributeDetail from './LiquidityHistories.enhanceContributeDetail';
import {View} from '@components/core';
import {BtnSecondary} from '@components/core/Button';
import styled from './LiquidityHistories.styled';
import {COLORS, FONTS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import {Row} from '@src/components/Row';
import Header from '@src/components/Header/Header';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/lib/wallet';
import {useNavigationParam} from '@src/hooks';
import ButtonBasic from '@src/components/Button/ButtonBasic';
import {Hook} from '../Wallet/TxHistoryDetail/TxHistoryDetail';

const ContributeDetail = ({handleRefund, handleRetry}) => {
  const history = useNavigationParam('history');
  const {refundData, retryData} = history;
  const handleOpenLink = txID => {
    if (!txID) return;
    linkingService.openUrlInSide(
      `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`,
    );
  };
  const onRefundTx = () => {
    const {tokenId, poolId, pairHash, nftId, amp} = refundData;
    const params = {
      fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
      tokenID: tokenId,
      poolPairID: poolId || '',
      pairHash,
      nftID: nftId,
      amplifier: amp || 0,
    };
    handleRefund(params);
  };

  const onRetryTx = () => {
    const {tokenId, poolId, pairHash, nftId, amp, amount} = retryData;
    const params = {
      fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
      tokenID: tokenId,
      poolPairID: poolId || '',
      pairHash,
      nftID: nftId,
      amplifier: amp || 0,
      amount,
    };
    handleRetry(params);
  };
  const hookFactories = React.useMemo(() => {
    const {
      pairId,
      poolId,
      statusStr,
      contributes,
      storageValue,
      timeStr,
      returnValue,
      statusColor,
    } = history;
    const headHook = [
      {
        label: 'PoolId',
        valueText: poolId,
        copyable: true,
        disabled: !poolId,
      },
      {
        label: 'PairId',
        valueText: pairId,
        disabled: !pairId,
        copyable: true,
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
    const contributeHook = [...contributes, ...storageValue].map(
      (item, index) => {
        index += 1;
        return [
          {
            label: `TxID${index}`,
            valueText: item.requestTx,
            copyable: true,
            openUrl: true,
            handleOpenLink: () => {
              handleOpenLink(item.requestTx);
            },
          },
          {
            label: `Amount ${index}`,
            valueText: item.contributeAmountSymbolStr,
          },
        ];
      },
    );
    const refunds = (returnValue || []).map((item, index) => [
      {
        label: `RefundTxID${index + 1}`,
        valueText: item.respondTx,
        disabled: !item.respondTx,
        copyable: true,
        openUrl: true,
        handleOpenLink: () => {
          handleOpenLink(item.respondTx);
        },
      },
      {
        label: `Refund ${index + 1}`,
        valueText: item.returnAmountSymbolStr,
        disabled: !item.returnAmount,
      },
    ]);
    return [...headHook, ...flatten(contributeHook), ...flatten(refunds)];
  }, [history]);
  return (
    <>
      <Header title="Detail" />
      <View borderTop style={mainStyle.container}>
        <ScrollView contentContainerStyle={{paddingTop: 12}}>
          {hookFactories.map(data => (
            <Hook
              key={data?.label}
              {...data}
              labelStyle={styled.leftText}
              valueTextStyle={[
                styled.rightText,
                !!data.rightColor && {color: data?.rightColor},
              ]}
              style={{marginTop: 8}}
            />
          ))}
          {!!refundData && (
            <Row spaceBetween style={{marginTop: 15}}>
              {!!retryData && (
                <BtnSecondary
                  title={retryData.title}
                  wrapperStyle={{flex: 1, marginRight: 20}}
                  onPress={onRetryTx}
                />
              )}
              <ButtonBasic
                title={refundData.title}
                btnStyle={{flex: 1}}
                onPress={onRefundTx}
              />
            </Row>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default withContributeDetail(memo(ContributeDetail));

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
