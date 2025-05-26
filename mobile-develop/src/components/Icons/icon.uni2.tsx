import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcUniIcon2 = require('../../assets/images/new-icons/uni2.png');

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const UniIcon2 = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={srcUniIcon2} style={[styled.icon, style]} {...rest} />;
};

export default UniIcon2;
