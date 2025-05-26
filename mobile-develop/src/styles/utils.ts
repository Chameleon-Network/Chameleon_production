import {Dimensions} from 'react-native';
import {
  scale as widthScale,
  verticalScale as heightScale,
} from 'react-native-size-matters';

export const deviceWidth = Dimensions.get('screen').width;

export const deviceHeight = Dimensions.get('screen').height;

export const screenHeight = Math.round(Dimensions.get('window').height);

export const screenWidth = Math.round(Dimensions.get('window').width);

export const verticalScale = heightScale;

export const scale = widthScale;
