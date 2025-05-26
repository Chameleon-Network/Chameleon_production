import React from 'react';
import Button from '../Button';
import styles from './style';

interface RoundCornerButtonProps {
  style?: object;
  titleStyle?: object;
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  }

const RoundCornerButton = ({ style, titleStyle, title = '', isLoading, disabled, ...props }: RoundCornerButtonProps) => (
  <Button
    style={[styles.button, style]}
    titleStyle={[styles.buttonTitle, titleStyle]}
    title={title}
    isLoading={isLoading}
    disabled={isLoading || disabled}
    isAsync={isLoading}
    {...props}
  />
);
export default RoundCornerButton;

