import BtnQuestionDefault from '@src/components/Button/BtnQuestionDefault';
import { Text } from '@src/components/core';
import { Row } from '@src/components/Row';
import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

const srcQuestionIcon = require('../../../assets/images/icons/help-inline.png');

export const styled = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  titleContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
    marginRight: 10,
  },
  hook: {
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  labelContainer: {
    flex: 1,
    maxWidth: '35%',
    alignItems: 'center',
    marginRight: 5,
  },
  label: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    marginRight: 5,
  },
  value: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    flex: 1,
    textAlign: 'right',
  },
  bold: {
    fontFamily: FONTS.NAME.bold,
  },
  hookCustomStyleBtnQuestion: {
    width: 14,
    height: 14,
  },
});

interface HookProps {
  key?: string;
  label: string;
  value: string;
  boldLabel?: boolean;
  boldValue?: boolean;
  hasQuestionIcon?: boolean;
  onPressQuestionIcon?: () => void;
  customValue?: React.ReactNode;
  titleStyle?: TextStyle;
  labelNumberOfLine?: number;
  valueNumberOfLine?: number;
  customStyledValue?: TextStyle;
  customStyledLabel?: TextStyle;
  styledHook?: ViewStyle;
}

export const Hook = React.memo((props: HookProps) => {
  const {
    label,
    value,
    boldLabel,
    boldValue,
    hasQuestionIcon,
    onPressQuestionIcon,
    customValue,
    customStyledValue,
    styledHook,
    customStyledLabel,
    labelNumberOfLine,
    valueNumberOfLine,
  } = props;
  const theme = useTheme()
  return (
    <Row style={[styled.hook, styledHook]}>
      <Row style={styled.labelContainer}>
        <Text
          style={[
            styled.label,
            { color: theme.subText },
            boldLabel && styled.bold,
            customStyledLabel ?? customStyledLabel,
          ]}
          numberOfLines={labelNumberOfLine || 1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
        {hasQuestionIcon && (
          <BtnQuestionDefault
            icon={srcQuestionIcon}
            onPress={onPressQuestionIcon}
            customStyle={styled.hookCustomStyleBtnQuestion}
          />
        )}
      </Row>
      {customValue ? (
        customValue
      ) : (
        <Text
          numberOfLines={valueNumberOfLine || 1}
          ellipsizeMode="tail"
          style={[
            styled.value,
            { color: theme.mainText },
            boldValue && styled.bold,
            customStyledValue,
          ]}
        >
          {value}
        </Text>
      )}
    </Row>
  );
});

interface ExtraProps {
  title: string;
  hooks: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

const Extra = (props: ExtraProps) => {
  const { title, hooks, containerStyle, titleStyle } = props;
  return (
    <View style={{ ...styled.container, ...containerStyle }}>
      {title && (
        <Row style={styled.titleContainer}>
          <Text style={{ ...styled.title, ...titleStyle }}>{title}</Text>
        </Row>
      )}
      {hooks}
    </View>
  );
};

export default React.memo(Extra);
