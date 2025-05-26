import MasterKeyModel from '@src/models/masterKey';
import {getWalletAccounts} from '@src/services/api/masterKey';
import {storage} from '@src/services/storage';
import LocalDatabase from './LocalDatabase';

// Network related functions that can be used by both modules
export const updateNetwork = async (networkObj = {}) => {
  try {
    const serverJSONString = await storage.getItem('$servers');
    const servers = JSON.parse(serverJSONString || '[]');
    const currentServer = servers.find((item: any) => item.default) || {
      id: 'mainnet',
    };
    const isMainnet = currentServer.id === 'mainnet';
    return {network: isMainnet ? 'mainnet' : 'testnet'};
  } catch (error) {
    console.log('updateNetwork error', error);
    return {network: 'mainnet'};
  }
};

// Common function for syncing server accounts that both modules might need
export const syncServerAccounts = async (wallet: any) => {
  try {
    const masterAccountInfo =
      await wallet.MasterAccount.getDeserializeInformation();
    const accounts = await getWalletAccounts(
      masterAccountInfo.PublicKeyCheckEncode,
    );
    if (accounts.length > 0) {
      wallet.MasterAccount.child = [];
      for (const account of accounts) {
        try {
          await wallet.importAccountWithId(account.id, account.name);
        } catch (error) {
          console.log('IMPORT ACCOUNT WITH ID FAILED', error);
        }
      }
    }
  } catch (error) {
    console.log('syncServerAccounts error', error);
  }
};

export const migrateData = async () => {
  let isMigratedData = false;
  const data = await storage.getItem('Wallet');

  if (data) {
    await storage.setItem(`$${MasterKeyModel.network}-master-masterless`, data);
    // await storage.removeItem('Wallet');
    isMigratedData = true;
  }

  const dexHistories = await LocalDatabase.getOldDexHistory();
  if (dexHistories.length > 0) {
    await storage.setItem(
      `$${MasterKeyModel.network}-master-masterless-dex-histories`,
      JSON.stringify(dexHistories),
    );
    isMigratedData = true;
  }

  return isMigratedData;
};