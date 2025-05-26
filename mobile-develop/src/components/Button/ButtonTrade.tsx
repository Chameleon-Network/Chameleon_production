import {FONTS, COLORS} from '@src/styles';
import React from 'react';
import {StyleSheet, StyleProp, ViewStyle, TextStyle} from 'react-native';
import ButtonBasic from './ButtonBasic';

const styled = StyleSheet.create({
  btnStyle: {
    backgroundColor: COLORS.colorBlue,
    height: 50,
  },
  titleStyle: {
    color: COLORS.white,
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.regular + 5,
  },
});

interface ButtonTradeProps {
  btnStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  [key: string]: any;
}

const ButtonTrade = React.memo(
  ({btnStyle, titleStyle, ...rest}: ButtonTradeProps) => {
    return (
      <ButtonBasic
        btnStyle={[styled.btnStyle, btnStyle]}
        titleStyle={[styled.titleStyle, titleStyle]}
        {...rest}
      />
    );
  },
);

export default ButtonTrade;
