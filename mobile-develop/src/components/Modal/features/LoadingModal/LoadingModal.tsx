import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '@src/styles';
import ActivityIndicator from '@src/components/core/ActivityIndicator';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  text: {
    color: COLORS.white,
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 10,
    textAlign: 'center',
    width: '50%',
  },
  title: {
    marginTop: 20,
  },
  desc: {
    marginTop: 20,
  },
});

interface LoadingModalProps {
  title: string;
  desc: string;
}

const LoadingModal = ({title, desc}: LoadingModalProps) => {
  return (
    <View style={styled.container}>
      <ActivityIndicator />
      {title && <Text style={[styled.text, styled.title]}>{title}</Text>}
      {desc && <Text style={[styled.text, styled.desc]}>{desc}</Text>}
    </View>
  );
};
export default LoadingModal;
