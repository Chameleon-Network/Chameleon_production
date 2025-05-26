import {TouchableOpacity} from '@src/components/core';
import React from 'react';
import {Image, StyleSheet} from 'react-native';

const QrCodeSrc = require('../../assets/images/icons/qr_code.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const BtnQRCode = ({source = QrCodeSrc, ...rest}) => {
  return (
    <TouchableOpacity {...rest}>
      <Image style={styled.icon} source={source} />
    </TouchableOpacity>
  );
};

export default BtnQRCode;
