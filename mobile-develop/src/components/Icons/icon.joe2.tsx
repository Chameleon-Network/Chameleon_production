import React from 'react';
import { StyleSheet, ImageProps, Image } from 'react-native';

const srcJoeIcon = require('../../assets/images/new-icons/joe_icon2.png');

const styled = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
});

const JoeIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={srcJoeIcon} style={[styled.icon, style]} {...rest} />;
};

export default JoeIcon;
