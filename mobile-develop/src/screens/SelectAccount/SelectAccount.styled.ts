import {THEME} from '@src/styles';
import {StyleSheet} from 'react-native';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    marginTop: 15,
  },
  titleStyled: {},
  subDesc: {
    ...THEME.text.boldTextStyleSuperMedium,
  },
  group: {
    marginBottom: 30,
  },
});
