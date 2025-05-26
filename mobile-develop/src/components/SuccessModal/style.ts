import { FONTS } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dialog: {
    height: 'auto',
  },
  dialogContent: {
    borderRadius: 8,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 62,
    height: 62,
    marginBottom: 30,
  },
  swapSuccess: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  dialogTitle: {
    ...FONTS.STYLE.bold,
    fontSize: FONTS.SIZE.superMedium,
    marginBottom: 15,
    marginTop: 8,
    lineHeight: FONTS.SIZE.superMedium + 5,
    textAlign: 'center',
  },
  dialogDesc: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 8,
    paddingHorizontal: 14,
    textAlign: 'center',
  },
  dialogButton: {
    ...FONTS.STYLE.bold,
    marginTop: 30,
    marginBottom: 20,
  },
  extraInfo: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 8,
    paddingHorizontal: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    borderRadius: 8
  },
  twoButton: {
    width: '48%',
  },
  twoButtonWrapper: {
    width: '100%',
  },
});
