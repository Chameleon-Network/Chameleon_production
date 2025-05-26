import React, {memo} from 'react';
import {createField} from './createField';
import {Switch} from '@src/components/core/Switch';

const renderCustomField = memo(({input, meta, ...props}) => {
  const {onChange, onBlur, onFocus, value} = input;
  return (
    <Switch
      {...props}
      onValueChange={value => onChange(value)}
      onBlur={onBlur}
      onFocus={onFocus}
      value={value}
    />
  );
});

export const SwitchField = createField({
  fieldName: 'SwitchField',
  render: renderCustomField,
});
