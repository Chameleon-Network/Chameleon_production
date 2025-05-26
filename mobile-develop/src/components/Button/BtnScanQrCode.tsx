import React from 'react';
import { Image, StyleSheet, TouchableOpacityProps } from 'react-native';
import { TouchableOpacity } from '@src/components/core';

const srcScanQrCode = require('../../assets/images/icons/qr_code_scan.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const BtnScanQrCode = (props: TouchableOpacityProps) => {
  return (
    <TouchableOpacity {...props}>
      <Image style={styled.icon} source={srcScanQrCode} />
    </TouchableOpacity>
  );
};


export default BtnScanQrCode;
