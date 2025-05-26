import React, {useRef} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface TouchableScaleProps {
  defaultScale?: number;
  activeScale?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  [key: string]: any;
}

const TouchableScale: React.FC<TouchableScaleProps> = ({
  defaultScale = 1,
  activeScale = 0.97,
  style,
  children,
  ...rest
}) => {
  const scaleAnimation = useRef(new Animated.Value(defaultScale)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnimation, {
      toValue: activeScale,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      {...rest}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Animated.View
        style={[
          style,
          {
            transform: [{scale: scaleAnimation}],
          },
        ]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default TouchableScale;
