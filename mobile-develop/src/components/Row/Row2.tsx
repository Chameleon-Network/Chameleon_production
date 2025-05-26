import React from 'react';
import {View2} from '@components/core/View';
import styles from './style';

interface Row2Props {
  style?: any;
  center?: boolean;
  children?: React.ReactNode;
  spaceBetween?: boolean;
  centerVertical?: boolean;
}

export const Row2 = ({
  style,
  center,
  children,
  spaceBetween,
  centerVertical,
}: Row2Props) => (
  <View2
    style={[
      styles.row,
      center && styles.center,
      spaceBetween && styles.spaceBetween,
      centerVertical && styles.centerVertical,
      style,
    ]}>
    {children}
  </View2>
);
