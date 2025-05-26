import React from 'react';
import Button from '../Button';
import styles from './style';

const RoundCornerButtonSolid = ({ style, titleStyle, title = '', isLoading, disabled, ...props }) => (
  <Button
    style={[styles.buttonSolid, style]}
    titleStyle={[styles.buttonSolidTitle, titleStyle]}
    title={title}
    isLoading={isLoading}
    disabled={isLoading || disabled}
    isAsync={isLoading}
    {...props}
  />
);
export default RoundCornerButtonSolid;
