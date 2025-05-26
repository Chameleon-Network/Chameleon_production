import MainLayout from '@src/components/MainLayout';
import { LoadingContainer } from '@src/components/core';
import { CONSTANT_CONFIGS } from '@src/constants';
import {
  navigateToInitImportMasterKey,
  navigateToInitMasterKey,
} from '@src/router/NavigationServices';
import { storage } from '@src/services/storage';
import { loadWallet } from '@src/services/wallet/WalletService';
import { setNewUserTutorial } from '@src/store/settings';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import BackupKeys from '../BackupKeys';
import ConfirmBackUpKeys from './ConfirmBackUpKeys';
import WelcomeNewUser from './WelcomeNewUser';
import WelcomeOldUser from './WelcomeOldUser';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

const Welcome = memo(() => {
  const [showBackUpKeys, setShowBackUpKeys] = useState(false);
  const [showConfirmBackUpKeys, setShowConfirmBackUpKeys] = useState(false);
  const [isExisted, setIsExisted] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [isBackUp, setIsBackUp] = useState(false);
  const [listAccount, setListAccount] = useState([]);
  const loadWalletData = useCallback(async () => {
    const data = await storage.getItem('Wallet');

    setIsExisted(!!data);

    if (data) {
      const wallet = await loadWallet(
        CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT,
      );
      const accounts = await wallet.listAccount();

      setListAccount(accounts);
    }

    setTimeout(() => {
      setLoadingWallet(false);
    }, 100);
  }, []);

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  const handleShowBackUp = useCallback(() => {
    setShowBackUpKeys(true);
  }, []);

  const handleCopy = useCallback(() => {
    setShowConfirmBackUpKeys(true);
  }, []);

  const handleImport = () => {
    navigateToInitImportMasterKey({ init: true });
  };

  const handleCreate = () => {
    navigateToInitMasterKey({ init: true });
  };

  useEffect(() => {
    setNewUserTutorial(true);
    loadWalletData();
  }, []);

  if (loadingWallet) {
    return <LoadingContainer />;
  }

  if (showBackUpKeys && !isBackUp && !showConfirmBackUpKeys) {
    return (
      <BackupKeys
        onNext={handleCopy}
        onBack={() => setShowBackUpKeys(false)}
        listAccount={listAccount}
      />
    );
  }

  if (!isBackUp && showConfirmBackUpKeys) {
    return (
      <ConfirmBackUpKeys
        onNext={() => setIsBackUp(true)}
        onBack={() => setShowConfirmBackUpKeys(false)}
      />
    );
  }

  console.log('isExisted', isExisted);

  const renderContent = () => {
    return !isExisted ? (
      <WelcomeNewUser onImport={handleImport} onCreate={handleCreate} />
    ) : (
      <WelcomeOldUser
        onImport={handleImport}
        onCreate={handleCreate}
        isBackUp={isBackUp}
        onBackUp={handleShowBackUp}
      />
    );
  };

  return (
    <MainLayout noHeader contentStyle={styles.flex}>
      {renderContent()}
    </MainLayout>
  );
});

export default Welcome;
