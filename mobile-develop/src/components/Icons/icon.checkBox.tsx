import { View } from '@components/core';
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from 'styled-components/native';

const VectorCheck = ({ color }) => (
  <Svg
    width={12}
    height={11}
    viewBox="0 0 12 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M11.9241 1.5636L10.4364 0.0759388C10.3867 0.027264 10.32 0 10.2504 0C10.1809 0 10.1141 0.027264 10.0645 0.0759388L3.79508 6.34535C3.74542 6.39402 3.67866 6.42129 3.60912 6.42129C3.53959 6.42129 3.47282 6.39402 3.42317 6.34535L1.93551 4.85769C1.88585 4.80902 1.81909 4.78175 1.74955 4.78175C1.68002 4.78175 1.61325 4.80902 1.5636 4.85769L0.0759388 6.34535C0.027264 6.39501 0 6.46177 0 6.53131C0 6.60084 0.027264 6.6676 0.0759388 6.71726L3.42317 10.0645C3.47282 10.1132 3.53959 10.1404 3.60912 10.1404C3.67866 10.1404 3.74542 10.1132 3.79508 10.0645L11.9241 1.93551C11.9727 1.88585 12 1.81909 12 1.74955C12 1.68002 11.9727 1.61325 11.9241 1.5636Z"
      fill={color}
    />
  </Svg>
);

const styled = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CheckBoxIcon = React.memo(({ active, style }) => {
  const theme = useTheme();
  return (
    <View style={[styled.box, style, { borderColor: theme.border2 }]}>
      {active && <VectorCheck color={theme.ctaMain} />}
    </View>
  );
});

export default CheckBoxIcon;
