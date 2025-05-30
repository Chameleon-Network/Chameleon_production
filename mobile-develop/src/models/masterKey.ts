import {
  loadBackupKey,
  parseStorageBackup,
} from 'incognito-chain-web-js/build/wallet';
// eslint-disable-next-line import/no-cycle
import {
  importWallet,
  initWallet,
  loadWallet,
  saveWallet,
} from '@services/wallet/WalletService';
import {getPassphrase} from '@services/wallet/passwordService';
import toLower from 'lodash/toLower';
import isEqual from 'lodash/isEqual';
import Server from '@services/wallet/Server';
// eslint-disable-next-line import/no-cycle
import trim from 'lodash/trim';
import formatUtil from '@utils/format';
import reverse from 'lodash/reverse';
import {
  getStorageLoadWalletError,
  setStorageLoadWalletError,
} from '@models/storageError';
// import {getWalletInstanceByImportMasterKey} from '@src/utils/masterKeyUtils';
import {storage} from '@src/services/storage';
import {syncServerAccounts} from '@src/utils/masterKeyUtils';

// Original implementation - do not modify
export const getWalletInstanceByImportMasterKey = async (data: any) => {
  let wallet;
  let newMasterKey;
  try {
    newMasterKey = new MasterKeyModel({
      ...data,
    });
    wallet = await importWallet(data.mnemonic, newMasterKey.getStorageName());
    await syncServerAccounts(wallet);
    newMasterKey.wallet = wallet;
    newMasterKey.mnemonic = wallet.Mnemonic;
    wallet.RootName = newMasterKey.name;
    await saveWallet(wallet);
  } catch (error) {
    console.log('getWalletInstanceByImportMasterKey', error);
  }
  return {wallet, newMasterKey};
};

class MasterKeyModel {
  static network = 'mainnet';
  public name?: string;
  public mnemonic?: string;
  public isActive?: boolean;
  public deletedAccountIds?: any[];
  public isMasterless?: boolean;
  public wallet?: any;

  constructor(data: any = {}) {
    this.name = data?.name;
    this.mnemonic = data?.passphrase;
    this.isActive = !!data?.isActive;
    this.deletedAccountIds = data?.deletedAccountIds || [];
    this.isMasterless =
      isEqual(toLower(this?.name), 'masterless') ||
      isEqual(toLower(this?.name), 'unlinked');
  }

  static getStorageName(name: string) {
    return `$${MasterKeyModel.network}-master-${name.toLowerCase()}`;
  }

  getStorageName() {
    return MasterKeyModel.getStorageName(this?.name || '');
  }

  async getBackupMasterKeys() {
    const [network, passphrase] = await Promise.all([
      Server.getNetwork(),
      getPassphrase(),
    ]);
    const storageKey = loadBackupKey(network);
    const backupStr = (await storage.getItem(storageKey)) || '';
    return parseStorageBackup({passphrase, backupStr}) || [];
  }

  /**
   * Load wallet from storage
   * @returns {Promise<Wallet>}
   */
  async loadWallet({callback, migratePassCodeToDefault = false} = {}) {
    console.time('TIME_LOAD_WALLET_FROM_STORAGE');
    const rootName = this.name;
    const storageName = this.getStorageName();
    const rawData = await storage?.getItem(storageName);
    const passphrase = await getPassphrase();
    let backupMasterKeys = [];
    let wallet;
    if (rawData) {
      console.log('loadWallet rawData', rawData);
      wallet = await loadWallet(
        passphrase,
        storageName,
        rootName,
        migratePassCodeToDefault,
      );
    }
    if (!wallet) {
      backupMasterKeys = reverse((await this.getBackupMasterKeys()) || []);
      /**
       * foundMasterKey = { name, mnemonic, isMasterless }
       * handle can't load wallet
       * load list backup in wallet and reimport again
       **/
      const foundMasterKey = backupMasterKeys.find(
        (item: any) => item?.name === rootName,
      );
      if (foundMasterKey && !foundMasterKey?.isMasterless) {
        const name = trim(foundMasterKey.name);
        const mnemonic = trim(foundMasterKey.mnemonic);
        wallet = (await getWalletInstanceByImportMasterKey({name, mnemonic}))
          ?.wallet;
        const errors = await getStorageLoadWalletError();
        errors.push({
          time: formatUtil.formatDateTime(new Date().getTime()),
          name,
          storageName,
          rootName,
          rawData: !!rawData,
          wallet: !!wallet,
          function: 'LOAD_WALLET_MASTER_KEY',
        });
        await setStorageLoadWalletError(errors);
        typeof callback === 'function' && callback(backupMasterKeys);
      }
    }

    /** Cant load wallet -> create new wallet */
    if (!wallet) {
      wallet = await initWallet(storageName, rootName);
    }
    this.mnemonic = wallet.Mnemonic;
    this.wallet = wallet;
    wallet.deletedAccountIds = this.deletedAccountIds || [];
    if (toLower(this.name) === 'unlinked') {
      this.name = 'Masterless';
      wallet.Name = this.getStorageName();
      await wallet.save();
    }
    wallet.Name = this.getStorageName();
    console.time('TIME_LOAD_WALLET_FROM_STORAGE');
    return wallet;
  }

  get noOfKeychains() {
    return this.wallet?.MasterAccount?.child.length || 0;
  }

  async getAccounts(deserialize = true) {
    if (!deserialize) {
      return this.wallet.MasterAccount.child;
    }

    const accountInfos = [];

    for (const account of this.wallet.MasterAccount.child) {
      const accountInfo = await account.getDeserializeInformation();
      accountInfo.Wallet = this.wallet;
      accountInfo.MasterKey = this;
      accountInfo.FullName = `${this.name}-${accountInfo.AccountName}`;
      accountInfos.push(accountInfo);
      accountInfo.MasterKeyName = this.name;
    }

    return accountInfos;
  }
}

export default MasterKeyModel;
