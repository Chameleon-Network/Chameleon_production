import React, {PropsWithChildren} from 'react';
import {View, ViewStyle} from 'react-native';

export const CssView = ({children, ...props}: PropsWithChildren<ViewStyle>) => {
  return <View style={props}>{children}</View>;
};
