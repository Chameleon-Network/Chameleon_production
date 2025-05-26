import React, {memo, useCallback} from 'react';
import {SelectFeeInput} from '../../SelectFee';
import {createField} from './createField';

const renderCustomField = memo(props => {
  const {input, ...rest} = props;
  const {onChange, ...restInput} = input;

  const handleChange = useCallback(
    (text: string) => {
      onChange(text);
    },
    [onChange],
  );
  return (
    <SelectFeeInput {...{...rest, ...restInput, onChangeText: handleChange}} />
  );
});

export const RFSelectFeeInput = createField({
  fieldName: 'RFSelectFeeInput',
  render: renderCustomField,
});
