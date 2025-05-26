import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcSpoonkyIcon = require('../../assets/images/new-icons/spooky_icon.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const SpoonkyIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={srcSpoonkyIcon} style={[styled.icon, style]} {...rest} />;
};

export default SpoonkyIcon;
