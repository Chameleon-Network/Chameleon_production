import React from 'react';
import { Image } from 'react-native';

const srcDownArrowIcon = require('../../assets/images/icons/circle_arrow_down.png');

const CircleArrowDownIcon = (props) => {
  const defaultStyle = {
    width: 40,
    height: 40,
  };
  const { style, source = srcDownArrowIcon, ...rest } = props;
  return (
    <Image
      source={source}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default CircleArrowDownIcon;
