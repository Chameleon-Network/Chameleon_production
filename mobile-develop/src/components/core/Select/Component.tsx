/* eslint-disable */
import React, {memo} from 'react';
import {View, Platform, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

import styleSheet from './style';

const isIOS = Platform.OS === 'ios';
const RNComponent = isIOS ? RNPickerSelect : Picker;

export const Select = memo(
  ({containerStyle, inputStyle, style, prependView, label, ...props}: any) => {
    return (
      <View style={[styleSheet.container, style]}>
        {label && <Text style={[styleSheet.label]}>{label}</Text>}
        <View style={[styleSheet.row, containerStyle]}>
          <RNComponent
            {...props}
            children={isIOS ? null : props.children}
            style={[styleSheet.input, inputStyle]}
          />
          {prependView}
        </View>
      </View>
    );
  },
);
