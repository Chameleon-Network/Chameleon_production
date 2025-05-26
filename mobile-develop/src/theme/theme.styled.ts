import {FONTS} from '@src/styles';
import {StyleSheet} from 'react-native';

const globalStyled = StyleSheet.create({
  defaultPadding: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  defaultPaddingHorizontal: {
    paddingHorizontal: 24,
  },
  defaultPaddingVertical: {
    paddingVertical: 24,
  },
  defaultBorderSection: {
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
  defaultPadding2: {
    paddingHorizontal: 24,
    paddingVertical: 5,
  },
  defaultPadding3: {
    paddingHorizontal: 24,
  },
  defaultPadding4: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  defaultBorderRadius: {
    borderRadius: 8,
  },
  defaultFormLabelText: {
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 4,
    fontFamily: FONTS.NAME.bold,
  },
  defaultFormLabel: {
    marginBottom: 8,
  },
  defaultFormInputText: {
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 4,
    fontFamily: FONTS.NAME.medium,
  },
});

export default globalStyled;
