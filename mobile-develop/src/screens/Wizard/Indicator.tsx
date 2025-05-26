import React, {useMemo} from 'react';
import {View2 as View} from '@src/components/core';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

interface IndicatorProps {
  number: number;
  activeIndex: number;
  style?: object | object[];
}

const Indicator: React.FC<IndicatorProps> = ({number, activeIndex, style}) => {
  const indicatorItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < number; i++) {
      items.push(
        <Icon
          key={i}
          name={i === activeIndex ? 'dot-circle-o' : 'circle-o'}
          style={styles.indicatorItem}
        />,
      );
    }
    return items;
  }, [number, activeIndex]); // Only recalculate when these values change

  return (
    <View style={[styles.indicatorContainer, style]}>{indicatorItems}</View>
  );
};

export default React.memo(Indicator);
