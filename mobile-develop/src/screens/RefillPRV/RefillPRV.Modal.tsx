import RefillPRV from '@src/components/RefillPRV';
import {navigateToTrade} from '@src/router/NavigationServices';
import {setRefillPRVModalVisible} from '@src/store/refillPRV';
import {modalVisibleSelector} from '@src/store/refillPRV/selector';
import React from 'react';
import {useSelector} from 'react-redux';

const RefillPRVModal = () => {
  const isVisible = useSelector(modalVisibleSelector);

  const cancelOnClick = async () => {
    console.log(' TO DO ');
  };

  const onTouchOutside = async () => {
    console.log(' TO DO ');
  };

  const confirmOnClick = async () => {
    setRefillPRVModalVisible(false);
    navigateToTrade({
      data: {},
    });
  };

  return (
    <RefillPRV
      isVisible={isVisible}
      cancelOnClick={cancelOnClick}
      confirmOnClick={confirmOnClick}
      onTouchOutside={onTouchOutside}
    />
  );
};

export default RefillPRVModal;
