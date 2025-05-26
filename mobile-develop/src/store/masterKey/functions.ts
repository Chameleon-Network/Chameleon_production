import { ExHandler } from '@services/exception';
import MasterKeyModel from '@src/models/masterKey';
import { getWalletAccounts } from '@src/services/api/masterKey';
import { clearWalletCaches } from '@src/services/cache';
import AccountService from '@src/services/wallet/accountService';
import { configsWallet, importWallet, saveWallet, storeWalletAccountIdsOnAPI } from '@src/services/wallet/WalletService';
import LocalDatabase from '@src/utils/LocalDatabase';
import { migrateData, syncServerAccounts, updateNetwork as utilsUpdateNetwork } from '@src/utils/masterKeyUtils';
import { Validator } from 'incognito-chain-web-js/build/wallet';
import { remove, uniqBy } from 'lodash';
import { batch } from 'react-redux';
import {
  syncCreateMasterKey,
  syncInitMasterKey,
  syncLoadAllMasterKey,
  syncLoadingInitial,
  syncRemoveMasterKey,
  syncSwitchMasterKey,
  syncUpdateMasterKey
} from '.';
import { defaultAccountWalletSelector } from '../account/selectors';
import getStore from '../getStore';
import { syncPairlist } from '../pairlist';
import { getPDexV3Instance } from '../pdexV3/functions';
import {
  actionRequestAirdropNFTForListAccount,
  actionSubmitOTAKeyForListAccount,
  reloadWallet,
} from '../wallet/functions';
import {
  currentMasterKeySelector,
  masterKeysSelector,
  masterlessKeyChainSelector,
  noMasterLessSelector,
} from './selectors';
import { storage } from '@src/services/storage';

const DEFAULT_MASTER_KEY = new MasterKeyModel({
  name: 'Wallet',
  isActive: true,
});

const MASTERLESS = new MasterKeyModel({
  name: 'Masterless',
  isActive: false,
});


const updateNetwork = async () => {
  const result = await utilsUpdateNetwork();
  MasterKeyModel.network = result.network;
};

export const initMasterKey = async (masterKeyName: string, mnemonic: string) => {
  console.time('TOTAL_TIME_INIT_MASTER_KEY ');
  console.log('initMasterKey', masterKeyName, mnemonic);
  try {
    await updateNetwork();
    const isMigrated = await migrateData();

    const test = await storage.getItem(`$${MasterKeyModel.network}-master-masterless`);
    const defaultMasterKey = new MasterKeyModel(DEFAULT_MASTER_KEY);
    const masterlessMasterKey = new MasterKeyModel(MASTERLESS);
    const masterlessWallet = await masterlessMasterKey.loadWallet();
    if (!isMigrated) {
      masterlessWallet.MasterAccount.child = [];
    }
    defaultMasterKey.name = masterKeyName;
    let wallet = await importWallet(
      mnemonic,
      defaultMasterKey.getStorageName(),
    );
    defaultMasterKey.mnemonic = wallet.Mnemonic;
    defaultMasterKey.wallet = wallet;
    wallet.RootName = masterKeyName;
    const masterKeys = [defaultMasterKey, masterlessMasterKey];
    await saveWallet(wallet);
    await saveWallet(masterlessWallet);
    batch(async () => {
      syncInitMasterKey(masterKeys);
      syncSwitchMasterKey(defaultMasterKey.name);
      reloadWallet()
      storeWalletAccountIdsOnAPI(wallet);
      await actionSubmitOTAKeyForListAccount(wallet);
      await actionRequestAirdropNFTForListAccount(wallet);
    });
  } catch (error) {
    throw error;
  }
  console.timeEnd('TOTAL_TIME_INIT_MASTER_KEY');
};

export const requestFetchPairs = async () => {
  try {
    const state = getStore().getState();
    const account = defaultAccountWalletSelector(state);
    const pDexV3Inst = await getPDexV3Instance({ account });
    const pairs = await pDexV3Inst.getListPair();
    if (pairs) {
      syncPairlist({ pairs });
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const removeMasterKey = async (name: any) => {
  try {
    const state = getStore().getState();
    const list = masterKeysSelector(state);
    const newList = remove([...list], item => item.name !== name);
    const activeItem = newList.find(item => item.isActive);
    if (!activeItem) {
      const firstItem = newList.filter(
        item => (item?.name || '').toLowerCase() !== 'masterless',
      )[0];
      batch(() => {
        firstItem?.name && switchMasterKey(firstItem?.name);
      });
    }
    batch(async () => {
      syncRemoveMasterKey(name);
      await loadAllMasterKeys();
      await loadAllMasterKeyAccounts();
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSyncAccountMasterKey = async (defaultMasterKey?: any) => {
  try {
    const state = getStore().getState();
    let masterKey: MasterKeyModel =
      defaultMasterKey || currentMasterKeySelector(state);
    if (masterKey.isMasterless) {
      return;
    }
    let wallet = masterKey.wallet;
    await configsWallet(wallet);
    let masterAccountInfo =
      await wallet.MasterAccount.getDeserializeInformation();
    const serverAccounts = await getWalletAccounts(
      masterAccountInfo.PublicKeyCheckEncode,
    );
    const accountIds: string[] = [];
    for (const account of wallet.MasterAccount.child) {
      const accountInfo = await account.getDeserializeInformation();
      accountIds.push(accountInfo.ID);
    }
    const newAccounts = serverAccounts.filter(
      item =>
        !accountIds.includes(item.id) &&
        !(masterKey.deletedAccountIds || []).includes(item.id),
    );
    if (newAccounts.length > 0) {
      let accounts = [];
      for (const account of newAccounts) {
        try {
          const newAccount = await wallet.importAccountWithId(
            account.id,
            account.name,
          );
          if (account?.name) {
            accounts.push(newAccount);
          }
        } catch (error) {
          console.log('IMPORT ACCOUNT WITH ID FAILED', error);
        }
      }
      await wallet.save();
    }
  } catch (error) {
    throw error;
  }
};

export const loadAllMasterKeyAccounts = async () => {
  // await dispatch(actionLoadingAllMasterKeyAccount(true));
  try {
    const state = getStore().getState();
    const masterKeys = [
      ...noMasterLessSelector(state),
      masterlessKeyChainSelector(state),
    ];
    let accounts: any[] = [];
    const tasks: any[] = [];
    for (const masterKey of masterKeys) {
      try {
        await actionSyncAccountMasterKey(masterKey);
        const masterKeyAccounts = await masterKey?.getAccounts(true);
        accounts = [...accounts, ...masterKeyAccounts];
        const wallet = masterKey?.wallet;
        if (wallet) {
          await actionRequestAirdropNFTForListAccount(wallet);
        }
      } catch (error) {
        console.log('ERROR LOAD ACCOUNTS OF MASTER KEYS', error);
      }
    }
    syncLoadAllMasterKey(accounts);
    await Promise.all(tasks);
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    //TODO: Do Later
    // dispatch(actionInitNotification());
  }
  // await dispatch(actionLoadingAllMasterKeyAccount(false));
};

export const loadAllMasterKeys = async ({
  migratePassCodeToDefault = false,
} = {}) => {
  try {
    await updateNetwork();
    let masterKeyList = uniqBy(
      await LocalDatabase.getMasterKeyList(),
      (item: any) => item?.name,
    ).map(item => new MasterKeyModel(item));
    const callback = async (backupKeys: any) => {
      //TODO: Do Later dev function
      // await dispatch(actionToggleTestReimportWallet());
      //TODO: Do Later performance function
      // dispatch(actionLogEvent({desc: JSON.stringify(backupKeys || [])}));
    };
    for (let masterKey of masterKeyList) {
      try {
        await masterKey.loadWallet({
          callback,
          migratePassCodeToDefault,
        });
      } catch (error) {
        console.log('LOAD WALLET ERROR', error, masterKey?.name);
      }
    }
    syncLoadAllMasterKey(masterKeyList);
  } catch (error) {
    console.log('loadAllMasterKeys error', error);
    throw error;
  }
};

const syncUnlinkWithNewMasterKey = async (newMasterKey: MasterKeyModel) => {
  const state = getStore().getState()
  const masterless = masterlessKeyChainSelector(state);
  const accounts = await masterless?.getAccounts();
  const masterLessWallet = masterless?.wallet;
  const wallet = newMasterKey.wallet;
  for (const account of accounts) {
    const findItemWithKey = (item: any) =>
      item?.getPrivateKey() === account.PrivateKey;
    const isCreated = await wallet.hasCreatedAccount(account.PrivateKey);
    if (isCreated) {
      const masterAccountIndex = wallet.MasterAccount.child.findIndex(
        findItemWithKey,
      );
      const masterlessAccount = masterLessWallet.MasterAccount.child.find(
        findItemWithKey,
      );

      masterLessWallet.MasterAccount.child = masterLessWallet.MasterAccount.child.filter(
        (item: any) => !findItemWithKey(item),
      );
      if (masterAccountIndex > -1) {
        const masterAccount = wallet.MasterAccount.child[masterAccountIndex];
        masterlessAccount.name = masterAccount.name;
        wallet.MasterAccount.child[masterAccountIndex] = masterlessAccount;
      } else {
        wallet.MasterAccount.child.push(masterlessAccount);
      }
      // Found duplicate account name
      if (wallet.MasterAccount.child.filter(findItemWithKey).length > 1) {
        const isDuplicatedNameAccount = wallet.MasterAccount.child.find(
          findItemWithKey,
        );
        if (isDuplicatedNameAccount) {
          let index = 1;
          let newName = isDuplicatedNameAccount.name + index;
          while (
            wallet.MasterAccount.child.find((item: any) => item?.name === newName)
          ) {
            index++;
            newName = isDuplicatedNameAccount.name + index;
          }
          isDuplicatedNameAccount.name = newName;
        }
      }
    }
  }
  await saveWallet(masterLessWallet);
  masterless && syncUpdateMasterKey(masterless);
};

export const importMasterKey = async (data: any, ignoreReloadWallet = false) => {
  console.time('TOTAL_TIME_IMPORT_MASTER_KEY');
  try {
    const newMasterKey = new MasterKeyModel({
      ...data,
    });
    let wallet = await importWallet(
      data.mnemonic,
      newMasterKey.getStorageName(),
    );
    await syncServerAccounts(wallet);
    newMasterKey.wallet = wallet;
    newMasterKey.mnemonic = wallet.Mnemonic;
    wallet.RootName = newMasterKey.name;
    await saveWallet(wallet);
    batch(async () => {
      syncCreateMasterKey(newMasterKey);
      syncSwitchMasterKey(data.name);
      !!ignoreReloadWallet && reloadWallet();
      actionSubmitOTAKeyForListAccount(wallet)
      actionRequestAirdropNFTForListAccount(wallet)
      syncUnlinkWithNewMasterKey(newMasterKey)
      loadAllMasterKeyAccounts()
    });
  } catch (error) {
    throw error;
  }
  console.timeEnd('TOTAL_TIME_IMPORT_MASTER_KEY');
};

export const createMasterKey = async (data: MasterKeyModel) => {
  let newMasterKey: MasterKeyModel, wallet: any;
  try {
    newMasterKey = new MasterKeyModel({
      ...data,
    });
    wallet = await importWallet(data.mnemonic, newMasterKey.getStorageName());
    newMasterKey.wallet = wallet;
    newMasterKey.mnemonic = wallet.Mnemonic;
    wallet.RootName = newMasterKey.name;
    await saveWallet(wallet);
    batch(async () => {
      syncCreateMasterKey(newMasterKey);
      syncSwitchMasterKey(data.name);
      await reloadWallet()
      await actionSubmitOTAKeyForListAccount(wallet);
      await actionRequestAirdropNFTForListAccount(wallet);
      await storeWalletAccountIdsOnAPI(wallet);
      await loadAllMasterKeyAccounts();
    });
  } catch (error) {
    throw error;
  }
};

export const actionLoadInitial = async () => {
  let list: MasterKeyModel[] = [];
  try {
    list = uniqBy(await LocalDatabase.getMasterKeyList(), item => item.name);
  } catch (error) {
    console.log('error-actionLoadInitial', error);
  } finally {
    syncLoadingInitial({
      loading: false,
      masterKeyList: list,
    });
  }
};

export const requestLoadDefaultWallet = async () => {
  try {
    await loadAllMasterKeys();
    const defaultAccountName =
      (await AccountService.getDefaultAccountName()) as string;
    await reloadWallet(defaultAccountName);
  } catch (error) {
    throw error;
  }
};

export const switchMasterKey = async (
  masterKeyName: string,
  accountName: string = '',
  ignoreReloadWallet = false,
) => {
  try {
    new Validator('switchMasterKey-masterKeyName', masterKeyName)
      .required()
      .string();
    new Validator('switchMasterKey-accountName', accountName).string();
    clearWalletCaches();
    // dispatch(switchhingMasterKey(true));
    syncSwitchMasterKey(masterKeyName);
    // dispatch(switchMasterKeySuccess(masterKeyName));
    if (ignoreReloadWallet) return;
    await reloadWallet(accountName);
  } catch (error) {
    throw error;
  } finally {
    // dispatch(switchhingMasterKey(false));
  }
};
