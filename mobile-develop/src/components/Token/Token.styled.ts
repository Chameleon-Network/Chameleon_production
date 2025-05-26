import { StyleSheet } from 'react-native';
import { FONTS, COLORS, screenWidth } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  extra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  extraTop: {
    marginBottom: 5,
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    // maxWidth: '60%',
  },
  leftText: {
    textAlign: 'left',
  },
  rightText: {
    textAlign: 'right',
  },
  boldText: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
  },
  displayName: {
    maxWidth: '80%',
  },
  text: {
    fontFamily: FONTS.NAME.medium,
    maxWidth: screenWidth / 2 - 50,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 4,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  pSymbol: {
    fontFamily: FONTS.NAME.specialRegular,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 4,
  },
  pSymbolBold: {
    fontFamily: FONTS.NAME.specialRegular,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
    color: COLORS.black,
  },
  redText: {
    color: COLORS.red,
  },
  greenText: {
    color: COLORS.green,
  },
  bottomText: {
    ...FONTS.TEXT.incognitoP1,
  },
  normalText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followText: {
    fontFamily: FONTS.NAME.regular,
    color: COLORS.colorGreyBold,
    lineHeight: FONTS.SIZE.regular + 3,
    fontSize: FONTS.SIZE.regular,
  },
});
