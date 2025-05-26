import { Text, View } from '@components/core';
import { BtnPrimary } from '@components/core/Button';
import React, { memo } from 'react';
import Modal from 'react-native-modal';
import styles from './styles';

interface RefillPRVProps {
  isVisible: boolean;
  cancelOnClick: () => void;
  confirmOnClick: () => void;
  onTouchOutside: () => void;
}

const RefillPRV = ({
  isVisible,
  cancelOnClick,
  confirmOnClick,
  onTouchOutside,
}: RefillPRVProps) => {
  return (
    <View>
      <Modal
        isVisible={isVisible}
        style={styles.dialog}
        onBackdropPress={onTouchOutside}
      >
        <View style={styles.hook}>
          <Text style={[styles.desc, { color: '#FFF' }]}>
            You need to refill PRV for the wallet to cover the network fee.
          </Text>

          <View style={styles.buttonArea}>
            <View style={styles.spaceView} />
            <BtnPrimary
              title="Sure"
              onPress={confirmOnClick}
              wrapperStyle={styles.wrapperConfirmBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(RefillPRV);
