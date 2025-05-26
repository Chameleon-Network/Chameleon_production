import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableOpacity } from '@components/core';
import { SwapIcon } from '@src/components/Icons';
import { Row } from '@src/components/Row';
import { Divider } from 'react-native-elements';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
});

interface SwapButtonProps {
  onSwapButtons: () => void;
  style?: StyleProp<ViewStyle>;
}

const SwapButton = ({ onSwapButtons, style }: SwapButtonProps) => (
  <Row style={[styled.container, style]}>
    <Divider />
    <TouchableOpacity onPress={onSwapButtons}>
      <SwapIcon />
    </TouchableOpacity>
    <Divider />
  </Row>
);

export default React.memo(SwapButton);
