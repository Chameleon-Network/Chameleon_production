import React from 'react';
import {ActivityIndicator as RNComponent} from 'react-native';
import {useTheme} from 'styled-components/native';

interface ActivityIndicatorProps {
  size?: 'small' | 'large';
}

const ActivityIndicator = ({size = 'small'}: ActivityIndicatorProps) => {
  const theme = useTheme();
  return <RNComponent color={theme.contrast} size={size} />;
};

export default ActivityIndicator;
