import { StyleSheet } from 'react-native';
import { FONTS, COLORS, deviceWidth } from '@src/styles';

const styles = StyleSheet.create({
  dialog: {
    margin: 25,
    position: 'relative',
    borderRadius: 13,
    width: deviceWidth - 50,
  },
  hook: {
    marginVertical: 50,
    padding: 20,
    borderRadius: 13,
  },
  title: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 5,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  desc: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
  },

  buttonArea: {
    marginTop: 30,
    width: '100%',
    flexDirection: 'row',
  },

  wrapperCancelBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    color: COLORS.blue5,
  },

  wrapperConfirmBtn: {
    flex: 1,
  },

  spaceView: {
    width: 20,
  },
});

export default styles;
