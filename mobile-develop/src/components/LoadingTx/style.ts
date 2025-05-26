import { deviceWidth, FONTS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  wrapper: {
    marginHorizontal: 25,
    borderRadius: 13,
    width: deviceWidth - 50,
    paddingHorizontal: 20,
    paddingVertical: 50,
    position: 'relative',
  },
  desc: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
    textAlign: 'center',
    marginTop: 15,
  },
  percent: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 5,
    textAlign: 'center',
    marginTop: 12,
  },
  btnClose: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default style;
