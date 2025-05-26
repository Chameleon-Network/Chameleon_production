import { StyleSheet } from 'react-native';
import { FONTS, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 25,
  },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  category: {
    marginTop: 30,
  },
  title: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 4,
    color: COLORS.white,
    paddingLeft: 25,
  },
  subTitle: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
    color: COLORS.black,
  },
});

export const listNewsStyled = StyleSheet.create({
  highlights: {
    backgroundColor: '#D9F4FF',
    padding: 15,
  },

  hook: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  hook1: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  hook2: {
    marginTop: 30,
  },
  hook3: {
    marginTop: 15,
  },
  icon: {
    width: 55,
    height: 55,
    marginRight: 20,
  },
  title: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    color: COLORS.white,
    flex: 1,
  },
  titleHighLight: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    color: COLORS.lightGrey36,
    flex: 1,
  },
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  desc: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    color: COLORS.blue5,
    marginRight: 4,
    lineHeight: FONTS.SIZE.regular,
  },
  date: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.small,
    color: COLORS.lightGrey36,
    flex: 1,
    marginTop: 8,
  },
  descNoIcon: {
    flex: 0,
    marginRight: 2,
  },
  circle: {
    backgroundColor: COLORS.black,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  extra: {
    borderBottomWidth: 1,
    borderColor: '#363636',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  listNews: {},
});
