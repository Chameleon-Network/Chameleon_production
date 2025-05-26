import React from 'react';
import { StyleSheet, View, Image, ImageProps } from 'react-native';
const srcIcon = require('../../assets/images/new-icons/wallet.png');

const styled = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 17.53,
    height: 20,
  },
});

const IconWallet = (props: ImageProps) => {
  return (
    <View style={[styled.container, props?.containerStyle]}>
      <Image style={[styled.icon, props?.style]} source={srcIcon} />
    </View>
  );
};

export default IconWallet;
