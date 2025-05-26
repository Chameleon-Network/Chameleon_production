import {StyleSheet} from 'react-native';
import {FONTS} from '@src/styles';

const styled = StyleSheet.create({
  hookContainer: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hookLabel: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
  },
  wrapValue: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  hookValue: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    textAlign: 'right',
  },
});

export default styled;
