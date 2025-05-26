import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcCurveIcon = require('../../assets/images/new-icons/curve2.png');

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const CurveIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={srcCurveIcon} style={[styled.icon, style]} {...rest} />;
};


export default CurveIcon2;
