import {navigateToLiquidityHistories} from '@src/router/NavigationServices';
import React, {memo} from 'react';
import {Image, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';

const historySrc = require('../../assets/images/new-icons/history-lp.png');

const styled = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 15,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: -5,
    bottom: -5,
  },
  image: {
    width: 22,
    height: 22,
  },
});

interface LPHistoryIconProps {
  style?: ViewStyle;
}

const LPHistoryIcon = ({style}: LPHistoryIconProps) => {
  return (
    <TouchableOpacity
      style={[styled.container, style]}
      onPress={navigateToLiquidityHistories}>
      <Image style={styled.image} source={historySrc} />
    </TouchableOpacity>
  );
};
export default memo(LPHistoryIcon);
