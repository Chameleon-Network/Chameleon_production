import {replaceCommaText} from '@utils/string';
import debounce from 'lodash/debounce';
import React from 'react';
import {Platform, TextInputProps} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import styles from './styles';

const StyledInput = styled.TextInput`
  color: ${({theme}) => theme.text1};
`;

// A custom hook for position of cursor's text input on Android OS
const useCursorInputTextForAndroid = ({value, onBlur, onFocus}) => {
  const [selection, setSelection] = React.useState(undefined);
  const [isFocused, setIsFocused] = React.useState(false);
  const handleSetSelectionForAnroid = React.useCallback(
    (selection, value) => {
      if (Platform.OS === 'android' && !!value) {
        setSelection(selection);
        setTimeout(() => {
          setSelection(undefined);
        }, 100);
      }
    },
    [value, selection],
  );
  const handleOnBlur = () => {
    setIsFocused(false);
    if (typeof onBlur === 'function') {
      onBlur();
    }
    handleSetSelectionForAnroid({start: 0, end: 0}, value);
  };

  const handleOnFocus = async () => {
    setIsFocused(true);
    if (typeof onFocus === 'function') {
      onFocus();
    }
    handleSetSelectionForAnroid(
      {start: value?.length, end: value?.length},
      value,
    );
  };
  const debounceHandleSelection = debounce(
    React.useCallback(value => {
      handleSetSelectionForAnroid({start: 0, end: 0}, value);
    }, []),
    100,
  );
  React.useEffect(() => {
    if (isFocused || !value) {
      return;
    }
    debounceHandleSelection(value);
  }, [value, isFocused]);
  return {
    selection,
    setSelection,
    handleOnBlur,
    handleOnFocus,
  };
};

export const BaseTextInput = (props: TextInputProps) => {
  const {
    style,
    editable = true,
    onFocus,
    onBlur,
    onChangeText,
    value,
    keyboardType,
    ...rest
  } = props;
  const theme = useTheme();
  const {selection, setSelection, handleOnBlur, handleOnFocus} =
    useCursorInputTextForAndroid({value, onBlur, onFocus});
  const handleChangeText = text => {
    setSelection(undefined);
    if (typeof onChangeText === 'function') {
      const newText = replaceCommaText({text, keyboardType});
      onChangeText(newText);
    }
  };
  return (
    <StyledInput
      placeholderTextColor={theme.text10}
      returnKeyType="done"
      autoCorrect={false}
      spellCheck={false}
      autoCompleteType="off"
      keyboardType={keyboardType}
      // style={[styles.input, style, !editable ? { color: colors.text4 } : null]}
      style={[styles.input, style]}
      editable={editable}
      value={value}
      selection={
        Platform.OS === 'android' && !!selection ? selection : undefined
      }
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      onChangeText={handleChangeText}
      {...rest}
    />
  );
};
