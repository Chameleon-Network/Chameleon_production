import React from 'react';
import {View} from 'react-native';
import styleSheet from './style';

const Container = ({style, ...props}) => (
  <View style={[styleSheet.container, style]} {...props} />
);

export default Container;
