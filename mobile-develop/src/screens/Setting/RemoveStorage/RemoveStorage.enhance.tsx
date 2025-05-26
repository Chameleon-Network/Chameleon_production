import DialogLoader from '@components/DialogLoader';
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import RNRestart from 'react-native-restart';
import RemoveStorageDialog from './RemoveStorageDialog';

const REMOVE_CACHED_KEYS = [
  // Coins
  'TOTAL-COINS',
  'COINS_STORAGE',
  'UNSPENT-COINS',
  'SPENT_COINS_STORAGE',
  'SPENDING-COINS-STORAGE',

  // History
  'SET_KEY_IMAGES',
  'SET_PUBLIC_KEY',
  'TX_HISTORY',
  'SWAP-TOKENS-IDS',
  'HISTORY',
  'HISTORIES',

  // Order
  'WITHDRAW-ORDER',

  // Follow tokens
  'FOLLOWING-TOKENS',
  'FOLLOWED-DEFAULT-TOKENS',
  'persist:followWallet',
];

const enhance = (WrappedComp: React.ComponentType<any>) => (props: any) => {
  const [removing, setRemoving] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const loadRemoveKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const UTXOCacheds: never[] = [];
    const walletCacheds: never[] = [];
    const storageCacheds = [];
    for (const key of keys) {
      const isExist = REMOVE_CACHED_KEYS.some(unUseKey =>
        (key || '').toLowerCase().includes(unUseKey.toLowerCase()),
      );
      if (isExist) {
        storageCacheds.push(key);
      }
    }
    return {UTXOCacheds, walletCacheds, storageCacheds};
  };

  const restartApp = () => {
    setTimeout(() => {
      setRemoving(false);
      RNRestart.Restart();
    }, 1000);
  };

  const handleRemoveStorage = async () => {
    try {
      setRemoving(true);
      const {UTXOCacheds, walletCacheds, storageCacheds} =
        await loadRemoveKeys();
      if (storageCacheds && storageCacheds.length > 0) {
        for (const key of storageCacheds) {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (e) {
    } finally {
      restartApp();
    }
  };

  const onPressRemove = () => setVisible(true);

  return (
    <>
      <WrappedComp
        {...{
          ...props,
          onPressRemove,
        }}
      />
      <RemoveStorageDialog
        visible={visible}
        onPressCancel={() => setVisible(false)}
        onPressAccept={() => {
          setVisible(false);
          handleRemoveStorage().then();
        }}
      />
      <DialogLoader loading={removing} />
    </>
  );
};

export default enhance;
