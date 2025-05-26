import BtnStar from '@src/components/Button/BtnStar';
import { Text, TouchableOpacity, View } from '@src/components/core';
import { Row } from '@src/components/Row';
import TwoTokenImage from '@src/screens/Portfolio/Portfolio.image';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { actionToggleFollowingPool } from '@src/store/pdexV3/pools/functions';
import { getDataByPoolIdSelector } from '@src/store/pdexV3/pools/selectors';
import { COLORS, FONTS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

interface PoolItemProps {
  poolId: string;
  onPressPool: (poolId: string) => void;
  style: StyleProp<ViewStyle>;
  isLast: boolean;
}

export const PoolItem = React.memo((props: PoolItemProps) => {
  const { poolId, onPressPool, style, isLast } = props;
  const data = useDebounceSelector(getDataByPoolIdSelector)(poolId);
  const theme = useTheme();
  if (!data) {
    return null;
  }
  const {
    isFollowed,
    poolTitle,
    apyStr,
    token1,
    token2,
    networkPairStr,
    isPRVUSDTPair
  } = data || {};

  const handleToggleFollowingPool = () =>
    actionToggleFollowingPool(poolId)

  const iconUrl1 = isPRVUSDTPair ? token2.iconUrl : token1.iconUrl;
  const iconUrl2 = isPRVUSDTPair ? token1.iconUrl : token2.iconUrl;

  return (
    <TouchableOpacity
      onPress={() => typeof onPressPool === 'function' && onPressPool(poolId)}
      style={[styled.container, { borderBottomWidth: 1, borderBottomColor: theme.border4 }, isLast && { marginBottom: 70, borderBottomWidth: 0 }, style]}
    >
      <Row centerVertical>
        <View style={{ marginTop: -12 }}>
          <TwoTokenImage iconUrl1={iconUrl1} iconUrl2={iconUrl2} />
        </View>
        <View fullFlex>
          <Row spaceBetween>
            <Text style={styled.name}>{poolTitle}</Text>
            <Row centerVertical>
              <Text style={styled.subText}>{`${apyStr}`}</Text>
              <View style={styled.block3}>
                <BtnStar onPress={handleToggleFollowingPool} isBlue={isFollowed} />
              </View>
            </Row>
          </Row>
          <Row spaceBetween style={{ marginTop: 4 }}>
            <Text style={[styled.network, { color: theme.text3 }]}>{networkPairStr}</Text>
            <Text style={styled.earnBtn}>Earn now</Text>
          </Row>
        </View>
      </Row>
    </TouchableOpacity>
  );
});

interface IPoolProps {
  poolId: string;
  onPressPool: (poolId: string) => void;
  isLast: boolean;
}

const Pool = (props: IPoolProps) => {
  const { poolId, onPressPool, isLast = false } = props;
  if (!poolId) {
    return null;
  }
  return <PoolItem poolId={poolId} onPressPool={onPressPool} isLast={isLast} />;
};

export default React.memo(Pool);

export const styled = StyleSheet.create({
  container: {
    ...globalStyled.defaultPaddingHorizontal,
    paddingVertical: 16
  },
  rowName: {
    alignItems: 'center',
  },
  name: {
    marginRight: 5,
    fontSize: FONTS.SIZE.medium,
    fontFamily: FONTS.NAME.medium,
  },
  nameFollowed: {
    color: COLORS.black,
  },
  subText: {
    fontSize: FONTS.SIZE.medium,
    fontFamily: FONTS.NAME.medium,
  },
  block1: {
    marginRight: 5,
  },
  block2: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  block3: {
    width: 25,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  network: {
    fontSize: 11,
    fontFamily: FONTS.NAME.medium,
    lineHeight: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  earnBtn: {
    marginLeft: 5,
    textAlign: 'center',
    fontSize: FONTS.SIZE.small,
    fontFamily: FONTS.NAME.medium,
    backgroundColor: '#1A73E8',
    paddingVertical: 6,
    borderRadius: 3,
    overflow: 'hidden',
    paddingHorizontal: 12
  }
});
