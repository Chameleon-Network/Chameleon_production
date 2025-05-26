import {StyleSheet} from 'react-native';
import {FONTS} from '@src/styles';

export const commonStyled = StyleSheet.create({
  container: {},
  label: {
    textTransform: 'uppercase',
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    color: '#000',
  },
  input: {
    fontFamily: FONTS.NAME.default,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    color: '#000',
    padding: 0,
    margin: 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },
  labelFocused: {
    color: '#25CDD6',
  },
  error: {
    color: '#f40000',
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.small - 1,
    lineHeight: FONTS.SIZE.small + 6,
  },
  inputFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#25CDD6',
  },
});
