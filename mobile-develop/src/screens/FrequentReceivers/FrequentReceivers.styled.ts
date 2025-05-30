import {StyleSheet} from 'react-native';
import {FONTS, COLORS} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginTop: 20,
  },
  label: {
    textTransform: 'none',
  },
  tip: {
    textAlign: 'center',
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    marginVertical: 40,
    paddingHorizontal: 40,
  },
});

export const styledModal = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 25,
  },
  title: {},
});

export const notFoundStyled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  hook: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    color: COLORS.colorGreyBold,
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 4,
    marginTop: 20,
  },
  notFoundImg: {
    width: 194,
    height: 164,
  },
  btnUseAddr: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export const listStyled = StyleSheet.create({
  container: {
    flex: 1,
  },
  all: {
    color: COLORS.black,
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    marginLeft: 15,
  },
  title: {
    paddingHorizontal: 25,
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
    color: COLORS.black,
  },
});
