import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface LoadingContainerProps {
  containerStyled?: StyleProp<ViewStyle>;
  custom?: React.ReactNode;
  size?: 'small' | 'large';
}

export const LoadingContainer = (props: LoadingContainerProps) => {
  const {containerStyled, custom, size} = props;
  return (
    <View style={[styled.container, containerStyled]}>
      <ActivityIndicator size={size || 'small'} />
      {custom && custom}
    </View>
  );
};
