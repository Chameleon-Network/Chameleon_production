import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';
const curveSrcIcon = require('../../assets/images/new-icons/curve.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const CurveIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={curveSrcIcon} style={[styled.icon, style]} {...rest} />;
};

export default CurveIcon;
