import React, {memo} from 'react';
import {createField} from './createField';
import {TradeInputAmount} from '../../TradeInputAmount';

export const renderCustomField = memo(props => {
  const {input, onChangeTextCustom, ...rest} = props;
  const {onChange, onFocus, onBlur, ...restInput} = input;
  return (
    <TradeInputAmount
      {...{
        ...rest,
        ...restInput,
        onChangeText: text => {
          onChange(text);
        },
        onFocus: event => onFocus(event),
        onBlur: event => onBlur(event),
      }}
    />
  );
});

export const RFTradeInputAmount = createField({
  fieldName: 'RFTradeInputAmount',
  render: renderCustomField,
});
