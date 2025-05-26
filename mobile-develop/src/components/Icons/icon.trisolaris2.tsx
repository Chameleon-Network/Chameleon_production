import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcTrisolarisIcon = require('../../assets/images/new-icons/trisolaris_icon2.png');

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const TrisolarisIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return (
    <Image source={srcTrisolarisIcon} style={[styled.icon, style]} {...rest} />
  );
};

export default TrisolarisIcon;
