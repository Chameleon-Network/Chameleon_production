import {COLORS, FONTS} from '@src/styles';
import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  label: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
  },
  input: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 4,
    color: COLORS.colorGreyBold,
    marginRight: 5,
    padding: 0,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionBtn: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 0,
    justifyContent: 'center',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBtn: {
    // backgroundColor: '#EFEFEF',
  },
  unSelectBtn: {
    borderColor: COLORS.colorGreyLight,
  },
  textSelectBox: {
    fontFamily: FONTS.NAME.specialMedium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.medium + 4,
    marginLeft: 10,
  },
  icon: {
    marginTop: 2,
    marginRight: 8,
    tintColor: COLORS.blue5,
  },
});

export default style;
