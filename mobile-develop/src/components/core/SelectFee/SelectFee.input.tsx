import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Row } from '@src/components/Row';
import { FONTS } from '@src/styles';
import { useTheme } from 'styled-components/native';
import { BaseTextInput } from '../BaseTextInput';
import { SelectFee } from './SelectFee';

const styled = StyleSheet.create({
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  input: {
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 5,
    fontFamily: FONTS.NAME.medium,
  },
});

export const SelectFeeInput = memo(props => {
  const {types, onChangeTypeFee, placeholder, editableInput, ...rest} = props;
  const theme = useTheme();
  return (
    <Row style={[styled.inputContainer, {backgroundColor: theme.grey7}]}>
      <View style={[styled.inputWrapper]}>
        <BaseTextInput
          style={{
            ...styled.input,
          }}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          ellipsizeMode="tail"
          numberOfLines={1}
          editable={editableInput}
          {...rest}
        />
      </View>
      <SelectFee
        types={types}
        onChangeTypeFee={onChangeTypeFee}
        canSelected={editableInput}
      />
    </Row>
  );
});
