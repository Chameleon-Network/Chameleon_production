import { COLORS, FONTS } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    height: 52,
    width: '100%',
  },
  buttonTitle: {
    fontSize: 16,
    ...FONTS.STYLE.semibold,
    color: COLORS.white
  },
  buttonSolid: {
    borderRadius: 8,
    backgroundColor: 'transparent' ,
    height: 52,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonSolidTitle: {
    fontSize: 16,
    ...FONTS.STYLE.semibold,
    color: COLORS.primary,
  },
});
