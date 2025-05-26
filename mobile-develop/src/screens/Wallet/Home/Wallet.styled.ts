import {StyleSheet} from 'react-native';
import {FONTS, COLORS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import {isIOS} from '@utils/platform';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const headerStyled = StyleSheet.create({
  container: {
    height: 45,
  },
  icon: {
    marginRight: 16,
  },
  notify: {
    position: 'absolute',
    width: 8,
    height: 8,
    right: 15,
    borderRadius: 4,
  },
});

export const styledBalance = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  wrapperAmount: {
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
  },
  balance: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.veryLarge,
    lineHeight: FONTS.SIZE.veryLarge + 10,
    maxWidth: '85%',
    height: '100%',
  },
  pSymbol: {
    fontFamily: FONTS.NAME.specialRegular,
    fontSize: FONTS.SIZE.veryLarge,
    lineHeight: FONTS.SIZE.veryLarge + 10,
    height: '100%',
  },
  balanceContainer: {
    // width: '100%',
  },
  wrapBalance: {
    minHeight: FONTS.SIZE.veryLarge + 10,
  },
  iconHide: {
    marginLeft: 5,
  },
  btnHideBalance: {
    // position: 'absolute',
    // right: -15,
    // top: -15,
    // width: 50,
    // height: 50,
    marginLeft: 6,
    paddingTop: 6,
  },
});

export const groupButtonStyled = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  tooltip: {
    // backgroundColor: COLORS.colorBlue,
    borderRadius: 11,
    marginBottom: 20,
    borderColor: COLORS.colorBlue,
    borderWidth: 1,
  },
  triangleStyle: {
    bottom: -30,
    left: '48%',
    borderBottomColor: COLORS.colorBlue,
    borderBottomWidth: 10,
  },
  btnClose: {
    position: 'absolute',
    top: 5,
    right: 0,
    width: 32,
    height: 32,
    zIndex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 3,
    color: COLORS.black,
    marginBottom: 5,
  },
  desc: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.small + 1,
    lineHeight: FONTS.SIZE.small + 6,
    color: COLORS.black,
  },
  wrapHook: {
    padding: 20,
    paddingBottom: 0,
  },
});

export const tokenStyled = StyleSheet.create({
  container: {
    ...globalStyled.defaultPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  wrapFirst: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  wrapSecond: {
    flex: 1,
    alignItems: 'flex-end',
    // height: '100%'
  },
  wrapThird: {
    flex: 1,
  },
  rowHeight: {
    height: FONTS.SIZE.regular + 8,
  },
  mainText: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 7,
    textAlign: 'left',
    marginBottom: isIOS() ? 0 : 5,
  },
  grayText: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 5,
  },
  centerVertical: {
    justifyContent: 'center',
  },
  iconVerify: {
    width: 12,
    height: 12,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  wrapHeader: {
    marginTop: 5,
    marginBottom: 10,
  },
  wrapLoader: {
    height: FONTS.SIZE.medium + 9,
    justifyContent: 'center',
  },
});

export const styledAddToken = StyleSheet.create({
  container: {},
});

export const DEFAULT_PADDING = 24;

export const homeStyled = StyleSheet.create({
  wrapHeader: {
    paddingHorizontal: DEFAULT_PADDING,
  },
  header: {
    height: 56,
  },
  headerIcon: {
    marginRight: 16
  },
  wrapBanner: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden'
  },
  mainCategory: {
    flex: 1,
    marginTop: 8,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.colorGrey4,
  },
  mediumBlack: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    color: COLORS.black,
    lineHeight: FONTS.SIZE.regular + 8,
  },
  volText: {
    textAlign: 'right',
    color: COLORS.newGrey,
    alignSelf: 'flex-end',
    width: '100%',
    fontSize: FONTS.SIZE.small,
  },
  regularGray: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.superSmall,
    color: COLORS.lightGrey34,
    lineHeight: FONTS.SIZE.superSmall + 3,
  },
  regularBlack: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.superSmall,
    color: COLORS.black,
    lineHeight: FONTS.SIZE.superSmall + 6,
    marginTop: 2,
  },
  rowImg: {
    marginTop: 16,
    alignItems: 'flex-end'
  },
  paddingTopCategory: {
    marginTop: 25
  },
  wrapCategory: {
    paddingVertical: 16,
    marginTop: 8
  },
  category: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentBoxWidth: {
    width: 68,
    alignItems: 'flex-end'
  },
  percentBox: {
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapPoolBox: {
    marginBottom: 24
  },
  itemBox: {
    flex: 0.5
  },
  tab: {
    marginTop: 15
  },
  tabDisable: {
    color: COLORS.lightGrey35
  },
  right: {
    textAlign: 'right',
    marginRight: 15
  },
  tabHeaderText: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    color: COLORS.lightGrey36,
    lineHeight: FONTS.SIZE.small + 6,
    marginVertical: 16
  },
  notify: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: COLORS.blue5,
    right: 15,
    borderRadius: 4
  },
  notifyText: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    color: COLORS.black,
    lineHeight: FONTS.SIZE.small + 3,
    marginLeft: 13,
  },
  wrapNotify: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 21,
    marginBottom: 13
  },
  mainVolume: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    marginTop: 20
  },
  wrapMainVolume: {
  },
  btnTrade: {
    width: 46,
    height: 21,
    backgroundColor: COLORS.blue5,
    marginLeft: 15,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelTrade: {
    color: COLORS.white,
    fontSize: FONTS.SIZE.superSmall,
  },
  tabStyled: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginRight: 16,
  },
  titleStyled: {
    color: COLORS.black,
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
  },
  tabStyledEnabled: {
    borderBottomColor: COLORS.colorBlue,
    borderBottomWidth: 2,
  }
});