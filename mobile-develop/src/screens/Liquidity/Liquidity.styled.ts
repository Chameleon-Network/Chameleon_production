import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  wrapInput: {
    marginTop: 27,
  },
  wrapAMP: {
    marginBottom: 27,
  },
  amp: {
    ...FONTS.STYLE.bold,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 15,
  },
  selectPercentAmountContainer: {
    marginTop: 40,
  },
  headerBox: {
    marginTop: 16,
    minHeight: FONTS.SIZE.medium + 9,
  },
  inputBox: {
    ...globalStyled.defaultPaddingHorizontal,
    marginTop: 32,
  },
  padding: {
    ...globalStyled.defaultPaddingHorizontal,
  },
  balanceStr: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.superSmall,
    lineHeight: FONTS.SIZE.superSmall + 3,
    color: COLORS.colorGrey3,
  },
  btnMax: {
    height: 20,
    marginLeft: 15,
    borderRadius: 0,
    paddingHorizontal: 5,
  },
  mediumText: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    color: COLORS.black,
    lineHeight: FONTS.SIZE.medium + 9,
  },
  warning: {
    color: COLORS.orange,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 9,
    fontFamily: FONTS.NAME.medium,
    marginTop: 10,
  },
});

export default styled;
