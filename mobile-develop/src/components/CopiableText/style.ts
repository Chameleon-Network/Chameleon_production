import {DECOR, SPACINGS} from '@src/styles';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  copyIcon: {
    flexBasis: 20,
    marginLeft: 3,
  },
  text: {
    flex: 1,
    fontWeight: '400',
  },
  textBox: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    borderRadius: DECOR.borderRadiusBorder,
    borderWidth: DECOR.borderWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACINGS.small,
    width: '100%',
  },
  desc: {},
});
