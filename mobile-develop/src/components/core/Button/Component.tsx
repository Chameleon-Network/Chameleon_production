import {COLORS} from '@src/styles';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Button as ButtonElements} from 'react-native-elements';
import TouchableScale from '../TouchableScale';
import styleSheet from './style';

export const ButtonExtension = React.memo(props => {
  const titleProps = {allowFontScaling: false, ...(props?.titleProps ?? {})};
  return <ButtonElements titleProps={titleProps} {...props} />;
});

interface ButtonProps {
  title: string;
  children?: React.ReactNode;
  textContainerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle> | ViewStyle[];
  titleStyle?: StyleProp<TextStyle>;
  type?: 'primary' | 'secondary' | 'tertiary';
  onPress: () => void;
  loadingColor?: string;
  disabled?: boolean;
  isLoading?: boolean;
  prepend?: React.ReactNode;
  isAsync?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  disabledTitleStyle?: StyleProp<TextStyle>;
}

const Button = ({
  title,
  children,
  textContainerStyle,
  buttonStyle,
  style,
  titleStyle,
  type,
  onPress,
  loadingColor = COLORS.white,
  disabled,
  isLoading: isLoadingProps,
  prepend,
  isAsync,
  disabledStyle,
  disabledTitleStyle,
  ...props
}: ButtonProps) => {
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(isLoadingProps ?? false);
  }, [isLoadingProps]);

  const handlePress = () => {
    if (isLoading || disabled) return null;

    if (typeof onPress === 'function') {
      requestAnimationFrame(() => {
        const pressed = onPress();
        if (pressed instanceof Promise) {
          setLoading(true);
          pressed.finally(() => setLoading(false));
        }
      });
    }
  };

  const renderChild = child => {
    if (typeof child === 'function') {
      return children(isLoading);
    }
    return child;
  };

  return (
    <TouchableScale
      {...props}
      onPress={handlePress}
      style={[
        styleSheet.button,
        type && styleSheet[`${type}Style`],
        disabled && styleSheet.disabled,
        disabled && disabledStyle,
        buttonStyle,
        style,
      ]}>
      {children ? (
        renderChild(children)
      ) : (
        <>
          {prepend}
          <View style={[styleSheet.textContainer, textContainerStyle]}>
            <Text
              style={[
                styleSheet.text,
                disabled ? disabledTitleStyle : {},
                titleStyle,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {title}
            </Text>
          </View>
          {isAsync && isLoading && (
            <ActivityIndicator
              style={[styleSheet.loadingIcon]}
              color={loadingColor}
              size="small"
            />
          )}
        </>
      )}
    </TouchableScale>
  );
};
export default Button;
