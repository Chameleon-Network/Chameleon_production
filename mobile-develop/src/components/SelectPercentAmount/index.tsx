import { Text, TouchableOpacity } from '@src/components/core';
import { COLORS, FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Row } from '../Row';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  btnContainer: {
    marginRight: 8,
    height: 32,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  percent: {
    fontSize: FONTS.SIZE.superSmall,
    fontFamily: FONTS.NAME.regular,
    textAlign: 'center',
    width: '100%',
  },
  btnLastChild: {
    marginRight: 0,
  },
});

interface SelectPercentAmountProps {
  size: number;
  percentBtnColor: string;
  containerStyled: any;
  selected: number;
  onPressPercent: (percent: number) => void;
  lastPercent: string;
}

const SelectPercentAmount = (props: SelectPercentAmountProps) => {
  const { selected, onPressPercent, lastPercent } = props;
  const {
    size = 4,
    percentBtnColor = COLORS.colorTradeBlue,
    containerStyled,
  } = props;
  const colors = useTheme();
  const renderMain = () => {
    return [...Array(size)].map((item, index, arr) => {
      const percent = (((index + 1) / size) * 100).toFixed(0);
      const lastChild = index === arr.length - 1;
      const isFilled = Number(percent) === Number(selected);
      const percentStr = `${percent}%`;
      return (
        <TouchableOpacity
          style={[
            {
              flex: 1,
              maxWidth: lastChild ? 'auto' : 56,
            },
            styled.btnContainer,
            lastChild && styled.btnLastChild,
            {
              backgroundColor: isFilled ? percentBtnColor : colors.secondary,
            },
          ]}
          onPress={() => onPressPercent(Number(percent))}
          key={percent}
        >
          <Text
            style={[
              styled.percent,
              { fontFamily: isFilled ? FONTS.NAME.medium : FONTS.NAME.regular },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {`${lastChild ? lastPercent || percentStr : percentStr} `}
          </Text>
        </TouchableOpacity>
      );
    });
  };
  return <Row style={[styled.container, containerStyled]}>{renderMain()}</Row>;
};



export default React.memo(SelectPercentAmount);
