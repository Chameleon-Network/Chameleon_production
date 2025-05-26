import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background2};
`;

const FlexView2 = (props) => {
  const { style, ...rest } = props;
  return (
    <Container {...rest} style={[style]} />
  );
};

export default FlexView2;
