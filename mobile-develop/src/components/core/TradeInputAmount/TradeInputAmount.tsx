import { MaxIcon } from '@src/components/Icons';
import { ArrowRight } from '@src/components/Icons/icon.arrowRightGreyIcon';
import { Row } from '@src/components/Row';
import { FONTS } from '@src/styles';
import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import { BaseTextInput } from '../BaseTextInput';
import { Text } from '../Text';
import { TouchableOpacity } from '../TouchableOpacity';
import { View } from '../View';

const incognito = require('@assets/images/new-icons/incognito.png');

export const Icon = (props: any) => {
  const {iconUrl, style} = props;
  return (
    <Image
      style={[{width: 20, height: 20}, style]}
      source={{uri: iconUrl}}
      defaultSource={incognito}
    />
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontSize: FONTS.SIZE.avgLarge + 2,
    lineHeight: FONTS.SIZE.avgLarge + 8,
    fontFamily: FONTS.NAME.medium,
    marginRight: 15,
  },
  symbol: {
    fontSize: FONTS.SIZE.avgLarge + 2,
    lineHeight: FONTS.SIZE.avgLarge + 8,
    fontFamily: FONTS.NAME.medium,
    marginRight: 10,
  },
  infinityIcon: {},
  // loadingIcon: {
  //   marginRight: 8,
  // },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: FONTS.SIZE.small,
    fontFamily: FONTS.NAME.regular,
  },
});

export const TradeInputAmount = memo((props: any) => {
  const {
    hasInfinityIcon = false,
    onPressInfinityIcon,
    symbol,
    canSelectSymbol,
    onPressSymbol,
    placeholder = '0',
    loadingBalance,
    editableInput,
    hasIcon = false,
    srcIcon = '',
    label = '',
    rightHeader,
    visibleHeader = false,
    inputStyle,
    ...rest
  } = props || {};
  const theme = useTheme();
  const renderSub = () => {
    if (hasIcon) {
      return <Icon iconUrl={srcIcon} />;
    }
    if (hasInfinityIcon) {
      return (
        <MaxIcon
          style={styled.infinityIcon}
          onPress={() =>
            typeof onPressInfinityIcon === 'function' && onPressInfinityIcon()
          }
        />
      );
    }
  };
  return (
    <View style={styled.container}>
      {visibleHeader && (
        <Row style={styled.header}>
          <Text
            numberOfLines={1}
            style={[styled.label, {color: theme.subText}]}>
            {label}
          </Text>
          {rightHeader && rightHeader}
        </Row>
      )}
      <View style={styled.inputContainer}>
        <BaseTextInput
          style={{
            ...styled.input,
            ...inputStyle,
          }}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          ellipsizeMode="tail"
          numberOfLines={1}
          editable={editableInput}
          {...rest}
        />
        {renderSub()}
        {!!symbol && (
          <TouchableOpacity style={{marginLeft: 16}} onPress={onPressSymbol}>
            <Row style={{alignItems: 'center'}}>
              {!!symbol && <Text style={styled.symbol}>{symbol}</Text>}
              {canSelectSymbol && <ArrowRight />}
            </Row>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});
