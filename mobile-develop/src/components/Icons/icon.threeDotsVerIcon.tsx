import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View } from '../core/View';

const srcThreeDotsVerIcon = require('../../assets/images/icons/three_dots_ver.png');

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const ThreeDotsVerIcon = (props: any) => {
  const defaultStyle = {
    width: 22,
    height: 6,
  };
  const { style, source, ...rest } = props;
  return (
    <View style={styles.container}>
      <Image
        source={srcThreeDotsVerIcon}
        style={[defaultStyle, style]}
        {...rest}
      />
    </View>
  );
};

