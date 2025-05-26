import { Text, View } from '@components/core';
import { BaseTextInput } from '@src/components/core/BaseTextInput';
import { Row } from '@src/components/Row';
import { THEME } from '@src/styles';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  label: {
    ...THEME.text.boldTextStyleSuperMedium,
  },
  input: {
    marginTop: 15,
    marginBottom: 30,
    ...THEME.text.superMediumTextMotto,
  },
  left: {
    flex: 1,
    marginRight: 15,
  },
});

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rightComponent?: React.ReactNode;
}
const Input = ({ label, value = '', onChangeText, placeholder, style, autoCapitalize = 'words', rightComponent }: InputProps) => {
  const input = (
    <BaseTextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={[styles.input, style, !!rightComponent && styles.left]}
      autoCapitalize={autoCapitalize}
    />
  );

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      {rightComponent ? (
        <Row spaceBetween center>
          {input}
          {rightComponent}
        </Row>
      ) : input}
    </View>
  );
};

export default Input;

