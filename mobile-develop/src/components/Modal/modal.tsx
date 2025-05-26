import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS} from '@src/styles';
import LoadingModal from './features/LoadingModal';
import {useSelector} from '@src/store/getStore';
import {modalLoadingSelector, modalSelector} from '@src/store/modal/selectors';
import {actionToggleModal} from '@src/store/modal/functions';

const ModalComponent = () => {
  const {visible, data, shouldCloseModalWhenTapOverlay, onBack} =
    useSelector(modalSelector);
  const {
    toggle: toggleLoading,
    title: titleLoading,
    desc: descLoading,
  } = useSelector(modalLoadingSelector);
  const handleToggle = async () => {
    shouldCloseModalWhenTapOverlay ? await actionToggleModal() : null;
  };
  const onRequestClose = async () => {
    await actionToggleModal();
    if (typeof onBack === 'function') {
      onBack();
    }
  };
  useEffect(() => {
    return () => {
      actionToggleModal();
    };
  }, []);
  if (!visible) {
    return null;
  }
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleToggle}
      onModalWillHide={onRequestClose}
      style={styled.container}
      backdropColor={COLORS.black}
      backdropOpacity={0.4}>
      {data}
      {toggleLoading && (
        <LoadingModal title={titleLoading} desc={descLoading} />
      )}
    </Modal>
  );
};

export default ModalComponent;

const styled = StyleSheet.create({
  container: {
    margin: 0,
  },
});
