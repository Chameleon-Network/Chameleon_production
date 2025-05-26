import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@components/core';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    paddingBottom: 20,
    width: '100%',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.white,
    position: 'absolute',
    bottom: -15,
    transform: [{ rotate: '180deg' }],
  },
  triangleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
interface TooltipProps {
  content: React.ReactNode;
  containerStyle?: any;
  triangleStyle?: any;
  triangleContainerStyle?: any;
}

const Tooltip = ({
  content,
  containerStyle,
  triangleStyle,
  triangleContainerStyle,
}: TooltipProps) => (
  <View style={[styled.container, containerStyle]}>
    {content}
    <View style={[styled.triangleContainer, triangleContainerStyle]}>
      <View style={[styled.triangle, triangleStyle]} />
    </View>
  </View>
);

export default React.memo(Tooltip);
