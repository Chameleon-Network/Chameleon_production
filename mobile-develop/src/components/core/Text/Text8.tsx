import React from 'react';
import {TextProps} from 'react-native';
import styled from 'styled-components/native';
import {styleText} from './style';

const StyledText = styled.Text`
  color: ${({theme}) => theme.text8};
`;

export const Text8 = ({style, ...rest}: TextProps) => (
  <StyledText
    {...rest}
    allowFontScaling={false}
    style={[styleText.root, style]}
  />
);
