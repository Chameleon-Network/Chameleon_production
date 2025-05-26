import React from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import CopiableText from '../CopiableText';
import {View} from '../core';
import ActivityIndicator from '../core/ActivityIndicator';
import QrCodeGenerate from '../QrCodeGenerate';
import accountAddressStyle from './style';

interface AccountAddressProps {
  data: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ViewStyle;
}

const AccountAddress = ({
  data = '',
  containerStyle,
  textStyle,
  iconStyle,
}: AccountAddressProps) => (
  <View style={accountAddressStyle.container}>
    {data ? (
      <>
        <QrCodeGenerate
          value={data}
          style={accountAddressStyle.qrCode}
          size={100}
        />
        <CopiableText
          oneLine
          showCopyIcon
          containerProps={{
            style: [accountAddressStyle.textBox, containerStyle],
          }}
          textProps={{
            style: [accountAddressStyle.text, textStyle],
            numberOfLines: 1,
            ellipsizeMode: 'middle',
          }}
          text={data}
        />
      </>
    ) : (
      <ActivityIndicator />
    )}
  </View>
);
export default AccountAddress;
