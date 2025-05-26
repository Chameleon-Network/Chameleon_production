import { Text, TouchableOpacity } from '@components/core';
import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

const styled = StyleSheet.create({
  containerStyle: {
    height: 24,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    ...FONTS.TEXT.incognitoSMedium,
  },
});

interface IButtonTyniProps extends TouchableOpacityProps {
  title: string;
  style?: ViewStyle;
}

const ButtonTyni = (props: IButtonTyniProps) => {
  const { title, style, ...rest } = props;
  const theme = useTheme()
  return (
    <TouchableOpacity
      style={[
        styled.containerStyle,
        { backgroundColor: theme.secondary },
        style,
      ]}
      {...rest}
    >
      <Text style={styled.titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(ButtonTyni);
