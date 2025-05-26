import React from 'react';
import { Image } from 'react-native';

const srcInfiniteIcon = require('../../assets/images/icons/infinite.png');

const InfiniteIcon = ({ style }: any) => {
  return (
    <Image
      source={srcInfiniteIcon}
      style={[{ width: 30, height: 14 }, style]}
    />
  );
};


export default InfiniteIcon;
