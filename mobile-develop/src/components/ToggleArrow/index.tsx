import { Text } from '@src/components/core';
import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { ArrowRightGreyIcon, ChevronIcon } from '../Icons';
import { Row } from '../Row';

const styled = StyleSheet.create({
  container: {},
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    marginRight: 10,
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
  },
  rightArrowRow: {
    justifyContent: 'flex-start',
  },
});

interface ToggleArrowProps {
  toggle: boolean;
  label: string;
  handlePressToggle: () => void;
  useRightArrow?: boolean;
  labelStyle?: TextStyle;
  style?: ViewStyle;
}

const ToggleArrow = (props: ToggleArrowProps) => {
  const {
    toggle,
    label,
    handlePressToggle,
    style,
    useRightArrow = false,
    labelStyle,
  } = props;
  return (
    <TouchableOpacity
      style={{
        ...styled.container,
        ...style,
      }}
      onPress={() => {
        if (typeof handlePressToggle === 'function') {
          handlePressToggle();
        }
      }}
    >
      <Row
        style={{
          ...styled.row,
          ...(useRightArrow ? styled.rightArrowRow : {}),
        }}
      >
        <Text style={{ ...styled.label, ...labelStyle }}>{label}</Text>
        {useRightArrow ? (
          <ArrowRightGreyIcon />
        ) : (
          <ChevronIcon toggle={toggle} />
        )}
      </Row>
    </TouchableOpacity>
  );
};

export default React.memo(ToggleArrow);
