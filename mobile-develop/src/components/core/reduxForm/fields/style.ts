import {StyleSheet} from 'react-native';
import {FONTS, COLORS} from '@src/styles';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  errorText: {
    fontFamily: FONTS.NAME.regular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    color: COLORS.red,
  },
  warningText: {
    fontFamily: FONTS.NAME.regular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    color: COLORS.orange,
  },
});
