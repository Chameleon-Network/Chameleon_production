import React from 'react';
import {SelectPicker} from '../../SelectPicker';
import {createField} from './createField';

const renderCustomField = ({input, meta, items, ...props}) => {
  const {onChange, value} = input;
  return (
    <SelectPicker
      {...props}
      items={items}
      onValueChange={data => onChange(data)}
      value={value}
    />
  );
};

const SelectPickerField = createField({
  fieldName: 'SelectPickerField',
  render: renderCustomField,
});

export default SelectPickerField;
