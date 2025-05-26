import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from '../core';
const srcOpenUrl = require('../../assets/images/new-icons/open-link.png');

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
  },
});

const IconOpenUrl = (props: any) => {
  return (
    <View style={[styled.container, props?.containerStyle]}>
      <Image style={[styled.icon, props?.style]} source={srcOpenUrl} />
    </View>
  );
};

export default IconOpenUrl;
