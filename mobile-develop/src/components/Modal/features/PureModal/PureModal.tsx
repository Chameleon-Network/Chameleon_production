import {Modal, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';

const styled = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
  },
});

interface IPureModalProps {
  visible: boolean;
  content: React.ReactNode;
  animationType?: 'none' | 'fade' | 'slide';
}

const PureModal = ({
  visible,
  content,
  animationType = 'fade',
  ...rest
}: IPureModalProps) => (
  <Modal
    presentationStyle="overFullScreen"
    animationType={animationType}
    visible={visible}
    transparent
    {...rest}>
    <SafeAreaView style={styled.overlay}>{content}</SafeAreaView>
  </Modal>
);

export default PureModal;
