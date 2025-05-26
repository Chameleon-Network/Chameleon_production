import React from 'react';
import styled from 'styled-components/native';
import globalStyled from '@src/theme/theme.styled';
import {StyleProp, ViewProps, ViewStyle} from 'react-native';

const Container = styled.View`
  background-color: ${({theme}) => theme.background1};
` as any;
interface IViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  fullFlex?: boolean;
  borderTop?: boolean;
  paddingHorizontal?: boolean;
  tabID?: string;
  label?: string;
}

export const View = (props: IViewProps) => {
  const {style, fullFlex, borderTop, paddingHorizontal, tabID, label, ...rest} =
    props;
  return (
    <Container
      {...rest}
      style={[
        fullFlex && {flex: 1},
        borderTop && globalStyled.defaultBorderSection,
        paddingHorizontal && globalStyled.defaultPadding,
        style,
      ]}
    />
  );
};
