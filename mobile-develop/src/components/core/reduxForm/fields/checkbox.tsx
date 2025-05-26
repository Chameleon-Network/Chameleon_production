import React from 'react';
import {Text, TouchableOpacity} from '@components/core';
import {CheckBoxIcon} from '@src/components/Icons';
import {createField} from './createField';
import {Row} from '@src/components/Row';

const renderCustomField = ({input, ...props}) => {
  const {value} = input;
  const {onPress, title, containerStyle, titleStyle} = props;
  let _value = false;

  try {
    _value = JSON.parse(value);
  } catch (e) {
    _value = false;
  }

  return (
    <TouchableOpacity
      onPress={() => typeof onPress === 'function' && onPress(_value)}
      style={[containerStyle]}>
      <Row centerVertical>
        <CheckBoxIcon active={!!_value} />
        <Text style={[titleStyle, {marginLeft: 10}]}>{title}</Text>
      </Row>
    </TouchableOpacity>
  );

  // return (
  //   <CheckBox
  //     {...props}
  //     title={title}
  //     checked={_value}
  //     containerStyle={{
  //       ...containerStyle,
  //       padding: 0
  //     }}
  //     onPress={() => typeof onPress === 'function' && onPress(_value)}
  //   />
  // );
};

export const CheckboxField = createField({
  fieldName: 'CheckboxField',
  render: renderCustomField,
});
