import { COLORS, FONTS, screenWidth } from '@src/styles';
import { StyleSheet } from 'react-native';


export const styled = StyleSheet.create({
  container: { flex: 1 },
  styledContainerHeaderTitle: {
    maxWidth: screenWidth - 190,
  },
});

export const groupBtnStyled = StyleSheet.create({
  groupButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  btnStyle: {
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0
  },
  titleStyle: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    color: COLORS.white,
  },
});

export const balanceStyled = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  amount: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.veryLarge,
    maxWidth: '100%',
    lineHeight: FONTS.SIZE.veryLarge + 4,
    textAlign: 'center',
  },
  amountBasePRV: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 10,
    maxWidth: screenWidth
  },
  changePrice: {
    ...FONTS.TEXT.incognitoP1,
  },
  hook: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 0
  },
  pSymbol: {
    fontFamily: FONTS.NAME.specialRegular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.medium + 4,
  },
  btnHideBalance: {
    marginLeft: 4
  },
  btnToggleBalance: {
    flexDirection: 'row'
  }
});

export const historyStyled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
  },
});
