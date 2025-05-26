import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  background-color: ${({theme}) => theme.background3};
`;

export const View3 = props => {
  const {style, fullFlex = false, ...rest} = props;
  return <Container {...rest} style={[style, fullFlex && {flex: 1}]} />;
};
