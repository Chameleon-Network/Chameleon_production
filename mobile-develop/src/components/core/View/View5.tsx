import React from 'react';
import styled from 'styled-components/native';
import globalStyled from '@src/theme/theme.styled';

const Container = styled.View`
  background-color: ${({theme}) => theme.background5};
`;

export const View5 = props => {
  const {
    style,
    fullFlex = false,
    borderTop = false,
    paddingHorizontal = false,
    ...rest
  } = props;
  return (
    <Container
      {...rest}
      style={[
        style,
        fullFlex && {flex: 1},
        borderTop && globalStyled.defaultBorderSection,
        paddingHorizontal && globalStyled.defaultPadding,
      ]}
    />
  );
};
