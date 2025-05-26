import { screenWidth } from '@src/styles';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    flex: 1,
  },
  styledSymbol: {
    maxWidth: '100%',
  },
  styledName: {
    maxWidth: screenWidth - 70,
  },
  styledContainerName: {
    maxWidth: '100%',
  },
  rightItem: {
    height: 24,
    width: 24
  }
});
