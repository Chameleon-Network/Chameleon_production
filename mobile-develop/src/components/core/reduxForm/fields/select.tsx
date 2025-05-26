import React, {memo} from 'react';
import {createField} from './createField';
import {Select} from '../../Select';

const renderCustomField = memo(({input, meta, ...props}) => {
  const {onChange, value} = input;
  return (
    <Select {...props} onChangeText={t => onChange(t)} defaultValue={value} />
  );
});

export const SelectField = createField({
  fieldName: 'InputField',
  render: renderCustomField,
});
