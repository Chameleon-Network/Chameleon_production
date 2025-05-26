import {Dimensions} from 'react-native';

export const isTablet = () => {
  const {width, height} = Dimensions.get('window');
  return (width < height && width > 700) || (width > height && height > 700);
};
