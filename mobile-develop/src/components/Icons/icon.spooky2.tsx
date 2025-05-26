import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcSpoonkyIcon2 = require('../../assets/images/new-icons/spooky2.png');

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const SpoonkyIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={srcSpoonkyIcon2} style={[styled.icon, style]} {...rest} />;
};

export default SpoonkyIcon2;
