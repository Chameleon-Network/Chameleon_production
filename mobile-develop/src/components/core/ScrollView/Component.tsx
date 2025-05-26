import globalStyled from '@src/theme/theme.styled';
import React from 'react';
import {ScrollViewProps} from 'react-native';
import styled from 'styled-components/native';
import styleSheet from './style';

const StyledScrollView = styled.ScrollView`
  background-color: ${({theme}) => theme.background1};
`;

interface IScrollViewProps extends ScrollViewProps {
  paddingBottom?: boolean;
  border?: boolean;
}

const ScrollView = React.forwardRef(
  (
    {
      style,
      contentContainerStyle,
      paddingBottom,
      border,
      ...otherProps
    }: IScrollViewProps,
    ref,
  ) => {
    return (
      <StyledScrollView
        style={[styleSheet.root, globalStyled.defaultPaddingHorizontal, style]}
        contentContainerStyle={[
          paddingBottom && styleSheet.content,
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        ref={ref}
        border={border}
        showsVerticalScrollIndicator={false}
        {...otherProps}
      />
    );
  },
);
export default ScrollView;
