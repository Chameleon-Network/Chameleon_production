import {COLORS, FONTS} from '@src/styles';
import {StyleSheet} from 'react-native';

export const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  title: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.veryLarge,
    lineHeight: 41,
    marginTop: 42,
    marginBottom: 25,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 30,
  },
  backButton: {
    width: '100%',
    marginTop: 50,
  },
  titleBtn: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 3,
    color: COLORS.white,
  },
  hook: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 25,
  },
  label: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 2,
    flex: 1,
    textAlign: 'left',
    minWidth: 20,
  },
  desc: {
    flex: 5,
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 2,
  },
});
