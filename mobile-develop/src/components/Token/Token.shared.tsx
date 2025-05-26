import React from 'react';
import { Image } from 'react-native';

const srcIncognito = require('../../assets/images/new-icons/incognito.png')

export const Icon = (props) => {
  const { iconUrl, style } = props;
  return (
    <Image
      style={[{ width: 20, height: 20 }, style]}
      source={{ uri: iconUrl }}
      defaultSource={srcIncognito}
    />
  );
};
