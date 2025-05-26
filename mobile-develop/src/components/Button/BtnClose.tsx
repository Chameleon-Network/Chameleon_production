import React from 'react';
import {TouchableOpacity} from 'react-native';
import {CloseIcon} from '../Icons';
import {COLORS} from '@src/styles';
import {TouchableOpacityProps} from 'react-native';

interface IBtnCloseProps extends TouchableOpacityProps {
  colorIcon?: string;
  size?: number;
}

const BtnClose = (props: IBtnCloseProps) => {
  const {colorIcon = COLORS.white, size = 28, ...rest} = props;
  return (
    <TouchableOpacity {...rest}>
      <CloseIcon colorIcon={colorIcon} size={size} />
    </TouchableOpacity>
  );
};

export default BtnClose;
