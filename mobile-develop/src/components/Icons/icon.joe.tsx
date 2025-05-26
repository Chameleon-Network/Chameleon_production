import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcJoeIcon = require('../../assets/images/new-icons/joe_icon.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const JoeIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={srcJoeIcon} style={[styled.icon, style]} {...rest} />;
};

export default JoeIcon;
