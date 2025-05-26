import { COLORS, FONTS } from '@src/styles';
import { StyleSheet } from 'react-native';

export const headStyled = StyleSheet.create({
  headContainer: {
    justifyContent: 'space-between',
    marginTop: 30,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  titleText: {
    color: COLORS.black,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 3,
    fontFamily: FONTS.NAME.bold,
  },
  searchText: {
    color: COLORS.newGrey,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 3,
    fontFamily: FONTS.NAME.medium,
  },
  btnSearch: {
    backgroundColor: COLORS.lightGrey19,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 32,
    borderRadius: 16,
  },
});

export const poolsListHeaderFollowingStyled = StyleSheet.create({
  text: {
    color: COLORS.newGrey,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 3,
    fontFamily: FONTS.NAME.medium,
  },
  centerText: {
    textAlign: 'center',
  },
  rightText: {
    textAlign: 'right',
  },
  wrapperFirstSection: {
    flex: 0.5,
  },
  wrapperSecondSection: {
    flex: 0.2,
  },
  wrapperThirdSection: {
    flex: 0.3,
  },
});

export const poolsListFollowingStyled = StyleSheet.create({
  flatList: {
    paddingBottom: 100,
  },
});

export const footerStyled = StyleSheet.create({
  text: {
    color: COLORS.black,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 3,
    fontFamily: FONTS.NAME.medium,
  },
});
