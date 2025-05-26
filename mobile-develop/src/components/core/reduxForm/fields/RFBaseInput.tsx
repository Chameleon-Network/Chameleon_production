import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {createField} from './createField';
import {FONTS} from '@src/styles';
import {useTheme} from 'styled-components/native';
import {Row} from '@src/components/Row';
import {BaseTextInput} from '../../BaseTextInput';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 5,
    fontFamily: FONTS.NAME.medium,
  },
});

const renderCustomField = memo(props => {
  const {input, rightCustom, inputStyle, ...rest} = props;
  const {onChange, onFocus, onBlur, ...restInput} = input;
  const theme = useTheme();
  return (
    <Row style={[styled.container, {backgroundColor: theme.grey7}]}>
      <BaseTextInput
        {...{
          ...rest,
          ...restInput,
          style: {
            ...styled.input,
            ...inputStyle,
          },
          onChangeText: text => onChange(text),
          onFocus: event => onFocus(event),
          onBlur: event => onBlur(event),
          editable: !!rest?.editableInput,
        }}
      />
      {rightCustom && rightCustom}
    </Row>
  );
});

export const RFBaseInput = createField({
  fieldName: 'RFBaseInput',
  render: renderCustomField,
});
