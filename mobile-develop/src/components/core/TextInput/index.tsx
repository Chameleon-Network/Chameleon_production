import { COLORS, FONTS } from '@src/styles';
import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native';

import BtnMax from '@src/components/Button/BtnMax';
import { useTheme } from 'styled-components/native';
interface InputProps {
  label?: string;
  validated?: {
    error?: boolean;
    message?: string;
  };
  containerStyled?: any;
  labelStyle?: any;
  showBorderBottom?: boolean;
  errorStyle?: any;
  hook?: React.ReactElement;
  inputMax?: {
    visible: boolean;
    handleShowMax: () => void;
  };
  containerInputStyle?: any;
  [key: string]: any; // To allow additional props such as those spread via ...rest
}

export const TextInput = React.forwardRef((props: InputProps, ref) => {
  const {
    label = '',
    labelStyle = {},
    errorStyle = {},
    validated = {},
    containerStyled = {},
    showBorderBottom = true,
    hook = null,
    inputMax = {
      visible: false,
      handleShowMax: () => null,
    },
    containerInputStyle,
    ...rest
  } = props;
  const [state, setState] = React.useState({
    isFocused: false,
  });
  const {isFocused} = state;
  const theme = useTheme();
  const onFocus = () => {
    setState({...state, isFocused: true});
    if (typeof rest.onFocus === 'function') {
      rest.onFocus();
    }
  };
  const onBlur = () => {
    setState({...state, isFocused: false});
    if (typeof rest.onBlur === 'function') {
      rest.onBlur();
    }
  };
  return (
    <View style={[commonStyled.container, containerStyled]}>
      {!!label && (
        <Text
          style={[
            commonStyled.label,
            isFocused ? commonStyled.labelFocused : null,
            labelStyle,
          ]}>
          {label}
        </Text>
      )}
      <View
        style={[
          inputStyled.inputContainer,
          containerInputStyle && containerInputStyle,
        ]}>
        <RNTextInput
          {...rest}
          ref={ref}
          style={[
            inputStyled.input,
            rest.style ? rest.style : null,
            {color: theme.text1},
          ]}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize="none"
          spellCheck={false}
          textAlignVertical="center"
          autoCompleteType="off"
          autoCorrect={false}
          allowFontScaling={false}
          placeholderTextColor={theme.subText}
        />
        {inputMax.visible && <BtnMax onPress={inputMax.handleShowMax} />}
      </View>
      {validated && validated.error && (
        <Text style={[commonStyled.error, errorStyle]}>
          {validated.message}
        </Text>
      )}
    </View>
  );
});

const inputStyled = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: FONTS.NAME.specialMedium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 4,
    padding: 0,
  },
});

const commonStyled = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    color: COLORS.colorGreyBold,
  },
  input: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    color: '#000',
    padding: 0,
    margin: 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },
  labelFocused: {},
  error: {
    color: '#f40000',
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.small - 1,
    lineHeight: FONTS.SIZE.small + 6,
  },
  inputFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#0DB8D8',
  },
});
