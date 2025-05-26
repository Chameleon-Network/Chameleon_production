import {COLORS, FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps {
  title: string;
  background?: string;
  wrapperStyle?: any;
  textStyle?: any;
  onPress: () => void;
  disabled?: boolean;
}

export const BtnPrimary = React.memo(
  ({
    title,
    background = COLORS.blue5,
    wrapperStyle,
    textStyle,
    onPress,
    disabled = false,
  }: ButtonProps) => {
    return (
      <TouchableOpacity
        style={[
          styles.wrapper,
          background && {backgroundColor: background},
          {opacity: disabled ? 0.5 : 1},
          wrapperStyle,
        ]}
        onPress={onPress}
        disabled={disabled}>
        {!!title && (
          <Text style={[styles.primaryText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  },
);

const TouchableSecondary = styled(TouchableOpacity)`
  background: white;
  border: 1px solid ${({theme}) => theme.borderBtnSecondary};
`;

interface BtnSecondaryProps extends ButtonProps {
  title: string;
  wrapperStyle?: any;
  textStyle?: any;
  onPress: () => void;
  disabled?: boolean;
}

export const BtnSecondary = React.memo(
  ({title, wrapperStyle, textStyle, onPress, disabled}: BtnSecondaryProps) => {
    return (
      <TouchableSecondary
        style={[styles.wrapper, {opacity: disabled ? 0.5 : 1}, wrapperStyle]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[styles.normalText, textStyle]}>{title}</Text>
      </TouchableSecondary>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  primaryText: {
    ...FONTS.STYLE.medium,
    color: COLORS.white,
    fontSize: FONTS.SIZE.medium,
  },
  normalText: {
    ...FONTS.STYLE.medium,
    color: COLORS.blue5,
    fontSize: FONTS.SIZE.medium,
  },
});
