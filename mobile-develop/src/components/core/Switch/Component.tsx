import React, {memo} from 'react';
import {Switch as RNComponent} from 'react-native';
import {COLORS} from '@src/styles';

export const Switch = memo(props => (
  <RNComponent
    thumbColor="white"
    trackColor={{true: COLORS.blue5, false: '#757575'}}
    style={{transform: [{scaleX: 0.85}, {scaleY: 0.85}]}}
    {...props}
  />
));
