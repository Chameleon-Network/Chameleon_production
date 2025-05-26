import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcUniIcon = require('../../assets/images/new-icons/uni.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const UniIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={srcUniIcon} style={[styled.icon, style]} {...rest} />;
};

export default UniIcon;
