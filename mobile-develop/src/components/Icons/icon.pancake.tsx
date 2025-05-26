import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcPancakeIcon = require('../../assets/images/new-icons/pancake.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const PancakeIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return (
    <Image source={srcPancakeIcon} style={[styled.icon, style]} {...rest} />
  );
};

export default PancakeIcon;
