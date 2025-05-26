import { StyleSheet } from 'react-native';
import { FONTS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: 30,
  },
  title: {
    ...FONTS.STYLE.bold,
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    ...FONTS.STYLE.medium,
    fontSize: 16,
    textAlign: 'center',
  },
});
