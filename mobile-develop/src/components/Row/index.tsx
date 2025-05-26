import React from 'react';
import {View} from '../core/View/Component';
import styles from './style';

interface RowProps {
  style?: any;
  center?: boolean;
  children?: React.ReactNode;
  spaceBetween?: boolean;
  centerVertical?: boolean;
}

export const Row = ({
  style,
  center,
  children,
  spaceBetween,
  centerVertical,
}: RowProps) => (
  <View
    style={[
      styles.row,
      center && styles.center,
      spaceBetween && styles.spaceBetween,
      centerVertical && styles.centerVertical,
      style,
    ]}>
    {children}
  </View>
);

export * from './Row2';
