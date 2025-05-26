import { Text, Text4, TouchableOpacity } from '@src/components/core';
import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  label: {
    ...FONTS.TEXT.label,
  },
  desc: {
    marginTop: 8,
    ...FONTS.TEXT.desc,
  },
});

interface ActionProps {
  label: string;
  desc: string;
  onPress: () => void;
}

const Action = ({ label, desc, onPress }: ActionProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text4 style={styles.desc}>{desc}</Text4>
    </TouchableOpacity>
  );
};

export default Action;
