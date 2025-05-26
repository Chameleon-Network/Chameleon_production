import React, {memo} from 'react';
import {
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import {CopyIcon} from '../Icons';

interface BtnCopyProps extends TouchableOpacityProps {
  containerStyle?: ViewStyle;
  iconStyle?: TextStyle;
  isHeader?: boolean;
}

const BtnCopy = memo((props: BtnCopyProps) => {
  const {containerStyle, iconStyle, isHeader, ...rest} = props;
  return (
    <TouchableOpacity {...rest}>
      <CopyIcon
        containerStyle={containerStyle}
        style={iconStyle}
        isHeader={isHeader}
      />
    </TouchableOpacity>
  );
});

export default BtnCopy;
