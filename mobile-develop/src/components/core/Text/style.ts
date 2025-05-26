import {StyleSheet} from 'react-native';
import {THEME} from '@src/styles';

export const styleText = StyleSheet.create({
  root: {
    ...THEME.text.defaultTextStyle,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
