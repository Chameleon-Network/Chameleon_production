import BottomBar from '@src/components/core/BottomBar';
import Header from '@src/components/Header/Header';
import withLazy from '@src/components/LazyHoc/withLazy';
import Modal from '@src/components/Modal';
import { navigateToConvertToUnifiedToken } from '@src/router/NavigationServices';
import { switchAccountSelector } from '@src/store/account/selectors';
import { checkConvertSelector } from '@src/store/convertToUnifiedToken/selectors';
import { useSelector } from '@src/store/getStore';
import React, { memo, useCallback } from 'react';
import FollowList from '../Wallet/FollowList/FollowList';

const AssetsScreen = () => {
  const isConvert = useSelector(checkConvertSelector);
  const switchingAccount = useSelector(switchAccountSelector);

  const navigateConvert = useCallback(() => {
    navigateToConvertToUnifiedToken()
  }, []);

  return (
    <>
      <Header hideBackButton title="Privacy Coins" accountSelectable />
      <FollowList />
      <Modal />
      {isConvert && !switchingAccount && (
        <BottomBar
          onPress={navigateConvert}
          text="You can maximize swap flexibility by unifying your privacy coins."
          autoscroll
        />
      )}
    </>
  );
};

export default withLazy(memo(AssetsScreen));
