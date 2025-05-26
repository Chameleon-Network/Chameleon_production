import {CircleBack} from '@src/components/Icons';
import React, {memo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface BtnCircleBackProps extends TouchableOpacityProps {
  btnStyle?: any;
}

const BtnCircleBack = memo((props: BtnCircleBackProps) => {
  const {btnStyle} = props;
  return (
    <TouchableOpacity style={[styles.btnStyle, btnStyle]} {...props}>
      <CircleBack />
    </TouchableOpacity>
  );
});

export default BtnCircleBack;
const styles = StyleSheet.create({
  btnStyle: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
});
