import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import IconOpenUrl from '../Icons/icon.openUrl';

const BtnOpenUrl = (props: TouchableOpacityProps) => {
  const { containerStyle, iconStyle, ...rest } = props;
  return (
    <TouchableOpacity {...rest}>
      <IconOpenUrl containerStyle={containerStyle} style={iconStyle} />
    </TouchableOpacity>
  );
};


export default BtnOpenUrl;
