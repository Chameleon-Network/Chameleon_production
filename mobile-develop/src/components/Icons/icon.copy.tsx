import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from '../core';
const srcCopy = require('../../assets/images/new-icons/copy.png');

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 15.09,
    height: 18,
  },
});

export const IconCopy = (props: any) => {
  return (
    <View
      style={[
        styled.container,
        props?.containerStyle,
      ]}
    >
      <Image style={[styled.icon, props?.style]} source={srcCopy} />
    </View>
  );
};

export default IconCopy;
