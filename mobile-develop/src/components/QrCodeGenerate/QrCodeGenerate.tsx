import { Text } from '@src/components/core';
import React, { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { StyleProp, ViewStyle, View } from 'react-native';
import styleSheet from './style';

interface QrCodeGenerateProps {
  value: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const QrCodeGenerate = ({ value, size = 150, style }: QrCodeGenerateProps) => {
  const [error, setError] = useState(null);

  return (
    <View style={[styleSheet.container, style, { width: size + 32 }]}>
      {error ? (
        <Text>Can not show QR code</Text>
      ) : (
        <QRCode value={value} size={size} onError={setError} />
      )}
    </View>
  );
};

export default QrCodeGenerate;
