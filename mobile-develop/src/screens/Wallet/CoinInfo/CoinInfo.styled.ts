import { StyleSheet } from 'react-native';
import { FONTS, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 4,
    width: 130,
    marginRight: 15,
  },
  labelIsVerified: {
    minWidth: 50,
    flex: 1,
    marginRight: 5,
  },
  value: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 4,
    flex: 5,
    textAlign: 'left',
  },
  verified: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 4,
    color: COLORS.green,
  },
  token: {
    marginBottom: 50,
  },
  wrapper: {
    marginTop: 27,
    flex: 1,
  },
  btnInfo: {
    flex: 1,
  },
});
