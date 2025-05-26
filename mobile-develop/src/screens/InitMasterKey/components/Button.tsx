import React from 'react';
import { StyleProp,ViewStyle, StyleSheet } from 'react-native';
import RoundCornerButton from '@src/components/core/RoundCornerButton';

const styles = StyleSheet.create({
  btn: {
    marginBottom: 30,
    marginTop: 50,
  },
});

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const Button = ({ label, onPress, style, disabled }: ButtonProps) => {
  return (
    <RoundCornerButton style={[styles.btn, style]} title={label} onPress={onPress} disabled={disabled} />
  );
};

export default Button;

