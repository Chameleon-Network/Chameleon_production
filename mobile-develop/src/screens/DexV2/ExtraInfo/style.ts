import { deviceWidth, FONTS } from '@src/styles';
import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    ...FONTS.STYLE.normal,
  },
  textLeft: {
    marginRight: 10,
  },
  textRight: {
    textAlign: 'right',
    maxWidth: deviceWidth - 155,
  },
  btnChevron: {
    justifyContent: 'center',
  },
  message: {
    ...FONTS.STYLE.medium,
    fontSize: 14, 
    marginVertical: 10,
  },
});
