import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TouchableOpacity } from '@src/components/core';
import { ArrowGreyDown } from '@src/components/Icons';
import { FONTS } from '@src/styles';
import { useSelector } from '@src/store/getStore';
import { poolSelectedDataSelector, rateDataSelector } from '@src/store/pdexV3/oderLimit/selectors';
import { navigateToChart, navigateToPoolsTab } from '@src/router/NavigationServices';
import { Row } from '@src/components/Row';
import BtnChart from '@src/components/Button/BtnChart';
import { useTheme } from 'styled-components/native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  top: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  block1: {
    marginRight: 15,
    flexDirection: 'row',
  },
  pool: {
    ...FONTS.TEXT.incognitoH3,
  },
  rate: {
    ...FONTS.TEXT.incognitoP1,
    marginRight: 8,
  },
  priceChange24hWrapper: {
    borderRadius: 4,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
    paddingHorizontal: 5,
  },
  priceChange24h: {
    ...FONTS.TEXT.incognitoP1,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});


interface IGroupActionsProps {
  callback: (poolId: string) => void;
  onPressRefresh?: () => void;
  hasChart?: boolean;
  canSelectPool?: boolean;
}

export const GroupActions = ({
  callback,
  onPressRefresh,
  hasChart = false,
  canSelectPool = true,
}: IGroupActionsProps) => {
  const colors = useTheme();
  const { poolId, poolStr, perChange24hToStr, perChange24hColor } = useSelector(
    poolSelectedDataSelector,
  );
  const { rateStr } = useSelector(rateDataSelector);
  const onPressChart = () =>
    navigateToChart({ poolId })

  const handleSelectPool = () => {
    navigateToPoolsTab({
      onPressPool: (poolId: string) => {
        if (typeof callback === 'function') {
          callback(poolId);
        }
      },
    });
  };
  return (
    <View style={styled.container}>
      <Row style={styled.top}>
        <TouchableOpacity
          style={styled.block1}
          onPress={() => canSelectPool && handleSelectPool()}
        >
          <Text style={styled.pool}>{poolStr}</Text>
          {canSelectPool && <ArrowGreyDown />}
        </TouchableOpacity>
        {hasChart && (
          <Row>
            <BtnChart style={{ marginRight: 10 }} onPress={onPressChart} />
          </Row>
        )}
      </Row>
      <Row style={styled.bottom}>
        <Text
          style={{ ...styled.rate, color: perChange24hColor || colors.subText }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {rateStr}
        </Text>
        <View
          style={{
            ...styled.priceChange24hWrapper,
          }}
        >
          <Text
            style={{
              ...styled.priceChange24h,
              color: perChange24hColor || colors.subText,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {perChange24hToStr}
          </Text>
        </View>
      </Row>
    </View>
  );
};



export default React.memo(GroupActions);
