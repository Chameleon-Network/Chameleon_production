import {FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../core';
import {useTheme} from 'styled-components/native';

const styled = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  btnMax: {
    fontSize: FONTS.SIZE.small,
    fontFamily: FONTS.NAME.medium,
  },
});

const MaxIcon = React.memo(({onPress, style}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styled.container, {borderColor: theme.borderBtnColor}, style]}>
      <Text style={styled.btnMax}>MAX</Text>
    </TouchableOpacity>
  );
});

export default MaxIcon;
