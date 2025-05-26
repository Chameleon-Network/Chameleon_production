import {BtnInfinite} from '@src/components/Button/BtnInfinite';
import {TextInput} from '@src/components/core/TextInput';
import {SEND} from '@src/constants/elements';
import formatUtil from '@src/utils/format';
import {replaceCommaText} from '@src/utils/string';
import {generateTestId} from '@utils/misc';
import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {createField} from './createField';

const styled = StyleSheet.create({
  btn: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
  },
});
const renderCustomField = ({
  input,
  meta,
  maxValue,
  onPressMax = null,
  keyboardType = 'decimal-pad',
  ...props
}) => {
  const {onBlur, onFocus, value, ...rest} = input;
  const inputRef = useRef(null);
  return (
    <TextInput
      {...{...props, ...rest}}
      keyboardType={keyboardType}
      onChangeText={t => {
        const newText = replaceCommaText({text: t, keyboardType});
        input.onChange(newText);
      }}
      onBlur={onBlur}
      onFocus={onFocus}
      defaultValue={value}
      returnKeyType="done"
      onRef={ref => {
        inputRef.current = ref;
      }}
      prependView={
        <BtnInfinite
          style={styled.btn}
          onPress={() => {
            onPressMax && onPressMax();
            input.onChange(
              formatUtil.numberWithNoGroupSeparator(Number(maxValue)),
            );
            inputRef?.current?.focus?.();
          }}
          {...generateTestId(SEND.MAX_BUTTON)}
        />
      }
    />
  );
};

export const InputMaxValueField = createField({
  fieldName: 'InputMaxValueField',
  render: renderCustomField,
});
