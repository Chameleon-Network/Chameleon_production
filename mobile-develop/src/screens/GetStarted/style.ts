import {StyleSheet} from 'react-native';

import {COLORS} from '../../styles/colors';
import {DECOR, FONTS} from '../../styles';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  getStartedBlock: {
    marginTop: 30,
    justifyContent: 'center',
    width: '100%',
  },
  getStartedBtn: {
    marginVertical: 30,
  },
  title: {
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 5,
    fontFamily: FONTS.NAME.medium,
    marginBottom: 30,
  },
  importKeyBlock: {
    height: 130,
  },
  centerText: {
    textAlign: 'center',
  },
  importBtn: {
    color: COLORS.blue,
    marginVertical: 20,
  },
  errorMsg: {
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
    fontFamily: FONTS.NAME.medium,
  },
  retryBtn: {
    marginTop: 30,
  },
  loadingContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    minHeight: 20,
  },
  bar: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.lightGrey6,
    borderRadius: DECOR.borderRadiusBorder,
  },
  barHighlight: {
    position: 'relative',
    left: 0,
    width: 100,
    height: 5,
    backgroundColor: COLORS.primary,
    borderRadius: DECOR.borderRadiusBorder,
  },
});
