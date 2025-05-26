import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '@src/styles';

export const itemStyled = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.transparent,
    marginBottom: 8
  },
  wrapContent: {
    padding: 16,
  },
  wrapBin: {
    flex: 1,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mediumBlack: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 9,
  },
  mediumGrey: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    paddingLeft: 36
  },
  shadow: {
    shadowRadius: 3,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'visible'
  },
  arrow: {
    width: 8,
    height: 13,
  },
  wrapSetting: {
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  wrapIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  swipeout: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  }
});

export const styled = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 0,
    paddingTop: 24,
  },
});

