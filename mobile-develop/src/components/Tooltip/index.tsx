import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from '@components/core';
import {COLORS, FONTS} from '@src/styles';

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    position: 'absolute',
    backgroundColor: COLORS.dark1,
    bottom: 100,
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: 240,
    borderRadius: 8,
  },
  title: {
    ...FONTS.STYLE.medium,
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
    color: COLORS.white,
    ...FONTS.STYLE.medium,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.dark1,
    position: 'absolute',
    bottom: -15,
    marginLeft: 15,
    left: '50%',
    right: '50%',
    transform: [{rotate: '180deg'}],
  },
});

interface TooltipProps {
  title: string;
  desc: string;
  containerStyled?: any;
}

const Tooltip = ({title, desc, containerStyled}: TooltipProps) => (
  <View style={[styles.container, containerStyled]}>
    {!!title && <Text style={styles.title}>{title}</Text>}
    <Text style={styles.desc}>{desc}</Text>
    <View style={[styles.triangle]} />
  </View>
);

export default React.memo(Tooltip);
