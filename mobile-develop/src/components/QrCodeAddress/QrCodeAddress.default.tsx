import {CopiableTextDefault as CopiableText} from '@src/components/CopiableText';
import {LoadingContainer, Text} from '@src/components/core';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import {COLORS, FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50,
  },
  label: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
  },
  qrCode: {
    marginVertical: 30,
  },
  boldText: {
    fontFamily: FONTS.NAME.bold,
  },
  smallText: {
    fontSize: 13,
    lineHeight: 15,
    marginTop: 5,
    color: COLORS.orange,
    fontFamily: FONTS.NAME.regular,
    marginBottom: 20,
  },
  text: {
    fontFamily: FONTS.NAME.regular,
    lineHeight: FONTS.SIZE.regular + 9,
    fontSize: FONTS.SIZE.regular,
    textAlign: 'center',
  },
});

interface NormalTextProps {
  text: string;
  style?: TextStyle;
  children?: React.ReactNode;
}

const NormalText = React.memo((props: NormalTextProps) => {
  const {text, style = null, children = null} = props;
  return (
    <Text style={[styled.text, style]}>
      {text}
      {children}
    </Text>
  );
});

interface QrCodeAddressProps {
  address: string;
  label: string;
  isPending: boolean;
  min: number;
  symbol: string;
}

const QrCodeAddress = (props: QrCodeAddressProps) => {
  const {address, label, isPending, min, symbol} = props;
  if (!address) {
    return <LoadingContainer />;
  }
  return (
    <View style={styled.container}>
      <Text style={styled.label}>{label}</Text>
      <View style={styled.qrCode}>
        <QrCodeGenerate value={address} size={150} />
      </View>
      {isPending && !!min && (
        <>
          <NormalText text="Minimum amount: ">
            <Text style={[styled.boldText]}>{`${min} ${symbol}`}</Text>
          </NormalText>
          <NormalText
            text="Smaller amounts will not be processed."
            style={styled.smallText}
          />
        </>
      )}
      <CopiableText data={address} />
    </View>
  );
};

export default QrCodeAddress;
