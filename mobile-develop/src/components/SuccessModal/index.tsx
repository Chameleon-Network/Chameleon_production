import React from 'react';
import Modal from 'react-native-modal';
import {SuccessIcon} from '@components/Icons';

import styles from './style';
import { useTheme } from 'styled-components/native';
import { Text, View } from '../core';
import { Row } from '../Row';
import RoundCornerButton from '../core/RoundCornerButton';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  description: string;
  closeSuccessDialog: () => void;
  onSuccess?: () => void;
  extraInfo?: string;
  buttonTitle?: string;
  buttonStyle?: object;
  successTitle?: string;
}

const SuccessModal = (props: SuccessModalProps) => {
  const {
    visible,
    title = '',
    description = '',
    buttonTitle = 'OK',
    extraInfo = '',
    closeSuccessDialog,
    buttonStyle = null,
    onSuccess,
    successTitle = '',
  } = props;

  const theme = useTheme();
  return (
    <Modal isVisible={visible} overlayStyle={styles.dialog}>
      <View style={[styles.dialogContent]}>
        <SuccessIcon fill={theme.icon1} />
        {!!title && (
          <Text style={[styles.dialogTitle]}>
            {title}
          </Text>
        )}
        {!!description && (
          <Text style={styles.dialogDesc}>
            {description}
          </Text>
        )}
        {!!extraInfo && (
          <Text style={styles.extraInfo}>
            {extraInfo}
          </Text>
        )}
        {onSuccess ? (
          <Row spaceBetween center style={styles.twoButtonWrapper}>
            <RoundCornerButton
              onPress={closeSuccessDialog}
              title={buttonTitle}
              style={[styles.button, buttonStyle, styles.twoButton]}
            />
            <RoundCornerButton
              onPress={onSuccess}
              title={successTitle}
              style={[styles.button, buttonStyle, styles.twoButton]}
            />
          </Row>
        ) : (
          <RoundCornerButton
            onPress={closeSuccessDialog}
            title={buttonTitle}
            style={[styles.button, buttonStyle]}
          />
        )}
      </View>
    </Modal>
  );
};





export default SuccessModal;
