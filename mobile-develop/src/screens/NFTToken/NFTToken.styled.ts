import {COLORS, FONTS} from '@src/styles';
import {StyleSheet} from 'react-native';

export const styled = StyleSheet.create({
  container: {flex: 1},
  scrollview: {
    flex: 1,
  },
  nftTokenItemContainer: {
    marginBottom: 15,
  },
  nftTokenItemWrapper: {
    justifyContent: 'space-between',
  },
  nftToken: {
    flex: 1,
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 3,
    color: COLORS.colorGreyBold,
  },
  amount: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 3,
    color: COLORS.colorGreyBold,
    flex: 1,
    textAlign: 'right',
  },
  listTitle: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 3,
    marginBottom: 15,
  },
  list: {
    marginBottom: 30,
  },
});
