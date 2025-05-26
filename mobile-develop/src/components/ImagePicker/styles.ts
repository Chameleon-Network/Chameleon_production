import {COLORS, FONTS} from '@src/styles';
import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {},
  leftContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    flexBasis: 100,
    backgroundColor: COLORS.lightGrey10,
    marginRight: 30,
    overflow: 'hidden',
  },
  rightContainer: {
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.primary,
    maxWidth: 300,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 14,
    letterSpacing: 0,
    marginHorizontal: 30,
  },
  text: {
    ...FONTS.TEXT.formInput,
    marginVertical: 10,
  },
  label: {
    ...FONTS.TEXT.formLabel,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: COLORS.colorGrey,
  },
  chooseFileContainer: {
    marginLeft: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chooseFile: {
    ...FONTS.TEXT.formInput,
    fontFamily: FONTS.NAME.bold,
    marginRight: 10,
  },
  hook: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default style;
