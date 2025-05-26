import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text3 } from '../core';

export const styled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    ...FONTS.STYLE.medium,
    fontWeight: '400',
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 9,
    textAlign: 'center',
    maxWidth: '80%',
    marginTop: 25,
  },
  image: {
    width: 80,
    height: 80,
  },
});

const EmptyBookIcon = ({ message }) => (
  <View style={styled.container}>
    {/* <Image source={EmptyIcon} style={styled.image} /> */}
    {!!message && <Text3 style={styled.message}>{message}</Text3>}
  </View>
);

export default EmptyBookIcon;
