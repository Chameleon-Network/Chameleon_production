import React from 'react';
import {
  Image,
  View2 as View,
  Text,
  TouchableOpacity,
} from '@src/components/core';
import Indicator from './Indicator';
import styles from './style';

interface BaseProps {
  title: string;
  desc: string;
  image: any;
  indicatorNumber: number;
  indicator: number;
  buttonText: string;
  buttonStyle: object;
  onPress: () => void;
}

const Base: React.FC<BaseProps> = ({
  image,
  title,
  desc,
  indicatorNumber,
  indicator,
  buttonText,
  onPress,
  buttonStyle,
}) => {
  return (
    <View style={styles.baseContainer}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
        <Indicator
          number={indicatorNumber}
          activeIndex={indicator}
          style={styles.indicator}
        />
        <TouchableOpacity
          onPress={onPress}
          style={[styles.button, buttonStyle]}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Base;
