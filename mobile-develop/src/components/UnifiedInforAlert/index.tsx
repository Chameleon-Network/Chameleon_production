import React, { memo } from 'react';
import Modal from 'react-native-modal';
import { useTheme } from 'styled-components/native';
import { Text, View } from '../core';
import { BtnPrimary } from '../core/Button';
import styles from './styles';

interface UnifiedInforAlertProps {
  isVisible: boolean;
  cancelOnClick: () => void;
  confirmOnClick: () => void;
  onTouchOutside: () => void;
}

const UnifiedInforAlert = ({
  isVisible,
  cancelOnClick,
  confirmOnClick,
  onTouchOutside,
}: UnifiedInforAlertProps) => {
  const colors = useTheme();
  return (
    <View>
      <Modal
        isVisible={isVisible}
        style={styles.dialog}
        onTouchOutside={onTouchOutside}
      >
        <View style={styles.hook}>
          <Text style={[styles.desc, { color: colors.text3 }]}>
            You can maximize swap flexibility by unifying your privacy coins.
          </Text>

          <View style={styles.buttonArea}>
            <BtnPrimary
              title="Later"
              onPress={cancelOnClick}
              wrapperStyle={styles.wrapperCancelBtn}
              textStyle={{ color: colors.ctaMain }}
            />
            <View style={styles.spaceView} />
            <BtnPrimary
              title="Unify"
              onPress={confirmOnClick}
              wrapperStyle={styles.wrapperConfirmBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default memo(UnifiedInforAlert);
