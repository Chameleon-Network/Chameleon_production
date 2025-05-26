/* eslint-disable */
import {View} from '@components/core';
import {Text4} from '@components/core/Text';
import React, {memo} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useTheme} from 'styled-components/native';
import styleSheet from './style';
import {RatioIcon} from '@src/components/Icons';

export const SelectOption = memo(
  ({
    containerStyle,
    inputStyle,
    labelStyle,
    style,
    prependView,
    label,
    items = [
      {label: 'a', value: 'a'},
      {label: 'b', value: 'b'},
    ],
    onChange,
    value = 'a',
  }: any) => {
    const theme = useTheme();
    return (
      <View style={[styleSheet.container, style]}>
        {label && (
          <View style={[styleSheet.labelContainer]}>
            <Text style={[styleSheet.label, labelStyle]}>{label}</Text>
          </View>
        )}
        <View style={[styleSheet.row, containerStyle]}>
          <View style={styleSheet.selectBox}>
            {items.map(item => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  style={[
                    styleSheet.optionBtn,
                    isSelected
                      ? styleSheet.selectedBtn
                      : styleSheet.unSelectBtn,
                  ]}
                  key={item.label}
                  onPress={() => onChange(item.value)}>
                  <View style={styleSheet.optionContent}>
                    <RatioIcon style={styleSheet.icon} selected={isSelected} />
                    <Text4
                      style={[
                        styleSheet.textSelectBox,
                        isSelected && {color: theme.text1},
                      ]}>
                      {item.label}
                    </Text4>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {prependView}
        </View>
      </View>
    );
  },
);
