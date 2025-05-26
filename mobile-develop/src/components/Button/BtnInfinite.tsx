import React, {memo} from 'react';
import {TouchableOpacity} from '@src/components/core/TouchableOpacity';
import {InfiniteIcon} from '@src/components/Icons';
import {TouchableOpacityProps} from 'react-native';

export const BtnInfinite = memo((props: TouchableOpacityProps) => {
  return (
    <TouchableOpacity {...props}>
      <InfiniteIcon />
    </TouchableOpacity>
  );
});
