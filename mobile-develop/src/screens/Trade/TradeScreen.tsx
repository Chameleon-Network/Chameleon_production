import React, {memo} from 'react';
import AppMaintain from '@components/AppMaintain';
import useFeatureConfig from '@src/shared/hooks/useFeatureConfig';
import {CONSTANT_APP} from '@src/constants';
import Modal from '@src/components/Modal';
import Trade from '../TradePDexV3/Trade';

const TradeScreen = memo(() => {
  const [_, isDisabled] = useFeatureConfig(CONSTANT_APP.DISABLED.TRADE);
  if (isDisabled) {
    return <AppMaintain />;
  }
  return (
    <>
      <Trade hideBackButton />
      <Modal />
    </>
  );
});

export default TradeScreen;
