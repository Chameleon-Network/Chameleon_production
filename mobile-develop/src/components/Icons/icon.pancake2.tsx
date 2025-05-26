import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';
const pancakeSrcIcon = require('../../assets/images/new-icons/pancake2.png');

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const PancakeIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return (
    <Image source={pancakeSrcIcon} style={[styled.icon, style]} {...rest} />
  );
};

export default PancakeIcon2;
