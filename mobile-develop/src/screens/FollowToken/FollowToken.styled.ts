import { StyleSheet } from 'react-native';
import { FONTS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingTop: 27,
  },
  text: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
  },
  boldText: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 6,
  },
  addManually: {
    ...globalStyled.defaultPaddingHorizontal,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listToken: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});
