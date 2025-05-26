import React from 'react';
import { TouchableOpacity, Image, StyleSheet, TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';

const srcChartIcon = require('../../assets/images/new-icons/candle.png');

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  icon: {
    width: 20.7,
    height: 12,
  },
});

const CustomTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.background1};
`;

interface IBtnChartProps extends TouchableOpacityProps {
  style?: any;
}

const BtnChart = (props: IBtnChartProps) => {
  const { style, ...rest } = props;
  return (
    <CustomTouchableOpacity style={[styles.container, style]} {...rest}>
      <Image source={srcChartIcon} style={styles.icon} />
    </CustomTouchableOpacity>
  );
};

export default BtnChart;
