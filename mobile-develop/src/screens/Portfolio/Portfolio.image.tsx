import ImageCached from '@src/components/ImageCached';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const srcIncognito = require('../../assets/images/new-icons/incognito.png');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  rightIcon: {
    left: -16,
    width: 33,
    height: 33,
    borderRadius: 16,
  }
});

interface ITwoTokenImageProps {
  iconUrl1: string;
  iconUrl2: string;
} 

const TwoTokenImage = React.memo(({ iconUrl1, iconUrl2 }: ITwoTokenImageProps) => {
  return (
    <View style={styles.container}>
      <ImageCached style={[styles.icon, iconUrl1 && iconUrl1.includes('prv') && { height: 34, width: 34 }]} uri={iconUrl1} defaultImage={srcIncognito} />
      <ImageCached style={[styles.rightIcon, iconUrl2 && iconUrl2.includes('prv') && { height: 34, width: 34 }]} uri={iconUrl2} defaultImage={srcIncognito} />
    </View>
  );
});


export default TwoTokenImage;
