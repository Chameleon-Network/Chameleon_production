import {Text, TouchableOpacity} from '@src/components/core';
import {COPYABLE_ADDRESS} from '@src/constants/elements';
import ClipboardService from '@src/services/ClipboardService';
import {COLORS} from '@src/styles';
import React, {memo} from 'react';
import {Icon} from 'react-native-elements';
import styleSheet from './style';
import {generateTestId} from '@src/utils/misc';
import { TextProps, TextStyle, ViewProps } from 'react-native';

const handlePress = (text: string, {copiedMessage = ''}: {copiedMessage?: string}, onPress?: () => void) => {
  ClipboardService.set(text, {copiedMessage});
  if (onPress) {
    onPress();
  }
};

interface CopiableTextProps {
  text: string;
  style?: TextStyle;
  children?: React.ReactNode;
  textProps?: TextProps;
  containerProps?: ViewProps;
  copiedMessage?: string;
  showCopyIcon?: boolean;
  oneLine?: boolean;
  onPress?: () => void;
}



const CopiableText = memo(
  ({
    text = '',
    style,
    children,
    textProps,
    containerProps,
    copiedMessage,
    showCopyIcon = true,
    oneLine = false,
    onPress,
  }: CopiableTextProps) => (
    <TouchableOpacity
      style={[styleSheet.textBox, style]}
      {...containerProps}
      onPress={() => handlePress(text, {copiedMessage}, onPress)}>
      {children || (
        <Text
          style={styleSheet.text}
          {...(oneLine ? {numberOfLines: 1, ellipsizeMode: 'middle'} : {})}
          {...textProps}
          {...generateTestId(COPYABLE_ADDRESS.ADDRESS)}>
          {text}
        </Text>
      )}
      {showCopyIcon && (
        <Icon
          type="material"
          name="content-copy"
          size={20}
          containerStyle={[styleSheet.copyIcon, oneLine ? {marginBottom: 10} : {}]}
          color={COLORS.primary}
          {...generateTestId(COPYABLE_ADDRESS.CPY_ICO)}
        />
      )}
    </TouchableOpacity>
  ),
);
export default CopiableText;
