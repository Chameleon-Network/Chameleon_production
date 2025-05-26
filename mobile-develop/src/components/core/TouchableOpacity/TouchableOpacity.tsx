import React from 'react';
import {TouchableOpacityProps} from 'react-native';
import styled from 'styled-components/native';
import {sleep} from '@src/utils/sleep';

const StyledTouchableOpacity = styled.TouchableOpacity``;

export const TouchableOpacity = (props: TouchableOpacityProps) => {
  const {onPress, activeOpacity = 0.6, ...rest} = props;
  const _onPress = async () => {
    await sleep(0.001);
    requestAnimationFrame(() => {
      if (typeof onPress === 'function') {
        onPress();
      }
    });
  };

  return (
    <StyledTouchableOpacity
      onPress={_onPress}
      activeOpacity={activeOpacity}
      delayPressIn={0}
      delayPressOut={0}
      delayLongPress={0}
      {...rest}
    />
  );
};
