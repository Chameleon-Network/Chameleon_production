import { CopiableTextDefault as CopiableText } from '@src/components/CopiableText';
import { LoadingContainer, TouchableOpacity } from '@src/components/core';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import { navigateToShield } from '@src/router/NavigationServices';
import { defaultAccountSelector } from '@src/store/account/selectors';
import { selectedPrivacy as selectedPrivacySelector } from '@src/store/selectedPrivacy/selectors';
import { COLORS, FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export const homeStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: 25,
    borderRadius: 8,
    paddingVertical: 30,
    paddingHorizontal: 16
  },
  desc: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 4,
    color: COLORS.lightGrey34,
    textAlign: 'center',
    marginVertical: 30,
  },
  sub: {
    color: COLORS.black,
    textDecorationLine: 'underline',
  },
  copyText: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 4,
    color: COLORS.lightGrey34,
    textAlign: 'center',
  },
});

const AddressModal = () => {
  const selectedPrivacy = useSelector(selectedPrivacySelector);
  const account = useSelector(defaultAccountSelector);
  const address = account.PaymentAddress;
  if (!selectedPrivacy) return <LoadingContainer />;
  return (
    <View style={homeStyle.container}>
      <QrCodeGenerate
        value={address}
        size={150}
      />
      <Text style={homeStyle.desc}>
        {
          'This is your address.\nUse it to receive any cryptocurrency\nfrom another Incognito address.'
        }
      </Text>
      <CopiableText data={address} textStyle={homeStyle.copyText} />
      {selectedPrivacy?.isDeposable && (
        <TouchableOpacity
          onPress={navigateToShield}
        >
          <Text style={homeStyle.desc}>
            {'To receive from outside Incognito,\n please use '}
            <Text style={[homeStyle.desc, homeStyle.sub]}>Deposit.</Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AddressModal;
