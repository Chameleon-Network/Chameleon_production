import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled.View`
  background-color: ${({theme}) => theme.background4};
`;

export const View4 = props => {
  const {style, fullFlex = false, ...rest} = props;
  return <Container {...rest} style={[style, fullFlex && {flex: 1}]} />;
};
