import globalStyled from '@src/theme/theme.styled';
import React from 'react';
import {ScrollViewProps} from 'react-native';
import styled from 'styled-components/native';
import styleSheet from './style';

const StyledScrollView = styled.ScrollView`
  background-color: ${({theme}) => theme.background1};
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
`;

interface ScrollViewBorderProps extends ScrollViewProps {
  border?: boolean;
  paddingBottom?: boolean;
}

export const ScrollViewBorder = React.forwardRef(
  (
    {
      style,
      contentContainerStyle,
      paddingBottom,
      border,
      ...otherProps
    }: ScrollViewBorderProps,
    ref,
  ) => (
    <StyledScrollView
      style={[styleSheet.root, globalStyled.defaultPadding, style]}
      contentContainerStyle={[
        styleSheet.root,
        paddingBottom && styleSheet.content,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      ref={ref}
      border={border}
      showsVerticalScrollIndicator={false}
      {...otherProps}
    />
  ),
);
