import {StyleSheet} from 'react-native';
import globalStyled from '@src/theme/theme.styled';
import {FONTS} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: globalStyled.defaultPadding.paddingHorizontal,
  },
});

export const styledHeaderTitle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    ...FONTS.TEXT.incognitoH4,
  },
  searchStyled: {
    textTransform: 'none',
    maxWidth: '100%',
  },
  containerTitle: {},
});
