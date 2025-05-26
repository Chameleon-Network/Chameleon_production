import {Text, View} from '@src/components/core';
import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {selectedPrivacy as selectedPrivacySelector} from '@src/store/selectedPrivacy/selectors';
import {useSelector} from 'react-redux';
import {FONTS} from '@src/styles';

const srcNoTransaction = require('../../../assets/images/icons/shield.png');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    lineHeight: FONTS.SIZE.regular + 5,
    fontSize: FONTS.SIZE.regular,
    fontFamily: FONTS.NAME.medium,
  },
  image: {
    marginBottom: 30,
    width: 52,
    height: 60,
  },
});

const EmptyHistory = () => {
  const selectedPrivacy = useSelector(selectedPrivacySelector);
  if (selectedPrivacy?.isDeposable) {
    return (
      <View style={styles.container}>
        <Image source={srcNoTransaction} style={styles.image} />
        <Text style={styles.text}>
          {`Trade some ${
            selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
          } to start\ntransacting anonymously.`}
        </Text>
      </View>
    );
  }
  return null;
};
export default EmptyHistory;
