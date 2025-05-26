import {StyleSheet} from 'react-native';
import {FONTS} from '@src/styles';

export default StyleSheet.create({
  wrapper: {
    paddingTop: 20,
  },
  wrapperItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  title: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 8,
  },
  status: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
  },
  desc: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
  },
  leftText: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    color: '#9C9C9C',
  },
  rightText: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    color: 'white',
  },
});
