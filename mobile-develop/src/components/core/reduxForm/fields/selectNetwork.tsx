import React, {memo} from 'react';
import {createField} from './createField';
import {SelectNetworkForUnshieldInput} from '../../SelectNetworkForUnshieldInput';

const renderCustomField = memo(
  ({input, items, networks, selectedNetwork, ...props}: any) => {
    const {onChange, value} = input;
    return (
      <SelectNetworkForUnshieldInput
        {...props}
        items={items}
        onChange={onChange}
        value={value}
        networks={networks}
        selectedNetwork={selectedNetwork}
      />
    );
  },
);

export const SelectNetworkFiled = createField({
  fieldName: 'SelectNetworkFiled',
  render: renderCustomField,
});
