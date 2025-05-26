import React, {memo} from 'react';
import {
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {COLORS, FONTS} from '@src/styles';
import {BaseTextInput} from './BaseTextInput';
import {Row} from '@src/components/Row';
import { Text } from '../Text';
import { CloseIcon, SearchIcon } from '@src/components/Icons';

const styled = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
  },
  inputStyle: {
    flex: 1,
    fontSize: FONTS.SIZE.large + 2,
    fontFamily: FONTS.NAME.medium,
  },
});

interface BaseTextInputCustomProps {
  inputProps: TextInputProps;
  canSearch?: boolean;
  renderCustom?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  value?: string;
}

export const BaseTextInputCustom = memo((props: BaseTextInputCustomProps) => {
  const inputProps: TextInputProps = props?.inputProps;
  const {canSearch = true, renderCustom, style, value, maskLabel} = props;
  const [_maskLabel, setMaskLabel] = React.useState(!!maskLabel);

  const handleRenderCustom = () => {
    if (renderCustom) {
      return renderCustom;
    }
    return (
      <View>
        {canSearch &&
          (value ? (
            <TouchableOpacity
              onPress={() => {
                inputProps &&
                  inputProps.onChangeText &&
                  inputProps.onChangeText('');
              }}>
              <CloseIcon size={22} />
            </TouchableOpacity>
          ) : (
            <SearchIcon />
          ))}
      </View>
    );
  };
  return (
    <Row style={[styled.container, style]}>
      {_maskLabel ? (
        <Text
          style={[styled.inputStyle, inputProps?.style]}
          onPress={() => setMaskLabel(false)}>
          {inputProps.placeholder}
        </Text>
      ) : (
        <BaseTextInput
          {...{
            ...inputProps,
            style: {...styled.inputStyle, ...inputProps?.style},
          }}
          value={value}
          placeholderTextColor={COLORS.white}
        />
      )}
      {handleRenderCustom()}
    </Row>
  );
});
