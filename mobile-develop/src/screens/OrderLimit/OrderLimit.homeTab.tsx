import {actionSetPoolSelected} from '@src/store/pdexV3/oderLimit/functions';
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {TradingVol24h} from '../Share';
import {FollowingPools} from '../Pools';
import {actionFetchPools} from '@src/store/pdexV3/pools/functions';
import {navigateToOrderLimit} from '@src/router/NavigationServices';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const TabOrderLimit = () => {
  const handlePressPool = async (poolId: string) => {
    await actionSetPoolSelected(poolId);
    navigateToOrderLimit();
  };
  useEffect(() => {
    actionFetchPools();
  }, []);
  return (
    <View style={styled.container}>
      <TradingVol24h />
      <FollowingPools handlePressPool={handlePressPool} />
    </View>
  );
};

export default React.memo(TabOrderLimit);
