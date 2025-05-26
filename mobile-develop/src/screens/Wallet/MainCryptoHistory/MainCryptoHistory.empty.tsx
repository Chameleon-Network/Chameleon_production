import {Text, View} from '@src/components/core';
import {useSelector} from '@src/store/getStore';
import {selectedPrivacy as selectedPrivacySelector} from '@src/store/selectedPrivacy/selectors';
import {FONTS} from '@src/styles';
import React from 'react';
import {Image, StyleSheet} from 'react-native';

const noTransactionSr = require('../../../assets/images/icons/shield_prv.png');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  text: {
    textAlign: 'center',
    lineHeight: FONTS.SIZE.regular + 4,
    fontSize: FONTS.SIZE.regular,
  },
  image: {
    marginBottom: 20,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});

const EmptyHistory = () => {
  const selectedPrivacy = useSelector(selectedPrivacySelector);
  return (
    <View style={styles.container}>
      <Image source={noTransactionSr} style={styles.image} />
      <Text style={styles.text}>
        {`${
          selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol
        } is fuel for Incognito. Use it to buy,\nsell and spend crypto privately.`}
      </Text>
    </View>
  );
};

export default React.memo(EmptyHistory);
