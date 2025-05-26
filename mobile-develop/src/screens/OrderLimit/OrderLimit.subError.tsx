import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@src/components/core';
import { COLORS, FONTS } from '@src/styles';
import { MESSAGES } from '@src/constants';

const styled = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 0,
  },
  text: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    color: COLORS.red,
    marginRight: 5,
  },
});

const TabOrderLimitSubError = ({ errorNetworkFee }: { errorNetworkFee: string }) => {
  if (!errorNetworkFee) return null;
  return (
    <View style={styled.container}>
      <Text style={styled.text}>{MESSAGES.PRV_NOT_ENOUGHT}</Text>
    </View>
  );
};

export default TabOrderLimitSubError;
