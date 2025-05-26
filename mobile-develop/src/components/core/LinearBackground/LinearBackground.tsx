import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LinearBackgroundProps {
  style?: StyleProp<ViewStyle>;
  opacity?: number;
  colorLevel?: '0' | '28' | '51' | '75' | '100';
  children?: React.ReactNode;
}

const COLOR_MAPS = {
  '0': ['#0AE0B6', '#0AE0B6'],
  '28': ['#20DE3C', '#20DE3C'],
  '51': ['#2EDF5E', '#2EDF5E'],
  '75': ['#22DE31', '#22DE31'],
  '100': ['#26E1BD', '#26E1BD'],
};

const LinearBackground: React.FC<LinearBackgroundProps> = ({
  style,
  opacity = 1,
  colorLevel = '100',
  children,
}) => {
  const colors = COLOR_MAPS[colorLevel];
  
  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LinearBackground;
