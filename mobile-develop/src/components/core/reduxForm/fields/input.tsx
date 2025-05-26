import React from 'react';
import {TextInput} from '@src/components/core/TextInput';
import {createField} from './createField';

const renderCustomField = ({input, ...props}) => {
  const {onChange, onBlur, onFocus, value, ...rest} = input;
  return (
    <TextInput
      {...{...props, ...rest}}
      onChangeText={t => onChange(t)}
      onBlur={onBlur}
      onFocus={onFocus}
      defaultValue={value}
    />
  );
};

export const InputField = createField({
  fieldName: 'InputField',
  render: renderCustomField,
});
