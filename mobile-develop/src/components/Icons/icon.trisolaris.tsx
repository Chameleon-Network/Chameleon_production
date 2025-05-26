import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';
const trisolarisIcon = require('../../assets/images/new-icons/trisolaris_icon.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const TrisolarisIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return (
    <Image source={trisolarisIcon} style={[styled.icon, style]} {...rest} />
  );
};

export default TrisolarisIcon;
