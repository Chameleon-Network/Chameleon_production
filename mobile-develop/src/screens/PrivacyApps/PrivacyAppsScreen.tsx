import AppMaintain from '@src/components/AppMaintain';
import Modal from '@src/components/Modal';
import { CONSTANT_APP } from '@src/constants';
import useFeatureConfig from '@src/shared/hooks/useFeatureConfig';
import React from 'react';
import PrivacyApps from '../PrivacyAppsPdexV3/PrivacyApps';

const PrivacyAppsScreen = React.memo(props => {

  const [_, isDisabled] = useFeatureConfig(CONSTANT_APP.DISABLED.PRIVACYAPP);

  if (isDisabled) {
    return <AppMaintain />;
  }
  return (
    <>
      <PrivacyApps hideBackButton />
      <Modal />
    </>
  );
});

export default PrivacyAppsScreen;
