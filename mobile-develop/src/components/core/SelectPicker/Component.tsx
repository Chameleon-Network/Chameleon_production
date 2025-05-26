/* eslint-disable */
import React from 'react';
import {Text, View} from 'react-native';
import RNComponent from 'react-native-picker-select';

import styleSheet from './style';

export const SelectPicker = ({
  containerStyle,
  inputStyle,
  labelStyle,
  style,
  prependView,
  label,
  ...props
}) => {
  return (
    <View style={[styleSheet.container, style]}>
      {label && (
        <View style={[styleSheet.labelContainer]}>
          <Text style={[styleSheet.label, labelStyle]}>{label}</Text>
        </View>
      )}
      <View style={[styleSheet.row, containerStyle]}>
        <RNComponent {...props} textInputProps={styleSheet.input} />
        {prependView}
      </View>
    </View>
  );
};
