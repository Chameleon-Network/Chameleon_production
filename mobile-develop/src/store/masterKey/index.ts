import {createSlice} from '@reduxjs/toolkit';
import {storage} from '@src/services/storage';
import AccountService from '@src/services/wallet/accountService';
import LocalDatabase from '@src/utils/LocalDatabase';
import _ from 'lodash';
import {StoreService} from '..';
import MasterKeyModel from '@src/models/masterKey';

export interface ListMasterKeyModel {
  list: MasterKeyModel[],
  accounts: any[],
  switching: boolean,
  initial: {
    loading: boolean,
    masterKeyList: any[],
  },
  loadingAll: boolean,
}

const initialState: ListMasterKeyModel = {
  list: [],
  accounts: [],
  switching: false,
  initial: {
    loading: true,
    masterKeyList: [],
  },
  loadingAll: false,
};

function _createMasterKey(newMasterKey: MasterKeyModel, list: MasterKeyModel[]) {
  const newList = _.uniqBy([...list, newMasterKey], item => item.name);
  LocalDatabase.setMasterKeyList(newList);
  return newList;
}

function updateMasterKey(newMasterKey: MasterKeyModel, list: MasterKeyModel[]) {
  const newList = list.map(item => {
    const found = item.name === newMasterKey.name;
    if (found) {
      return newMasterKey;
    }
    return item;
  });
  LocalDatabase.setMasterKeyList(newList);
  return newList;
}

function switchMasterKey(name: string, list: MasterKeyModel[]) {
  const newList = list.map(item => {
    item.isActive = item?.name === name;
    return item;
  });

  LocalDatabase.setMasterKeyList(newList);

  return newList;
}

function removeMasterKey(name: string, list: MasterKeyModel[]) {
  const newList = _.remove(list, item => item.name !== name);
  list.forEach(async item => {
    try {
      const wallet = await item.loadWallet();
      const measureStorageWallet = await wallet.getKeyMeasureStorage();
      await wallet.clearWalletStorage({key: measureStorageWallet});
      const listAccount: any[] = await wallet.listAccount() || [];
      let task = listAccount.map(account =>
        AccountService.removeCacheBalance(account, wallet),
      );
      await Promise.all(task);
    } catch (error) {
      console.log('ERROR remove master key', error);
    }

    await storage.removeItem(item.getStorageName());
  });
  LocalDatabase.setMasterKeyList(newList);
  return newList;
}

function saveMasterKeys(list: MasterKeyModel[]) {
  LocalDatabase.setMasterKeyList(list);
}

export const masterKeySlice = createSlice({
  name: 'masterKey', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    syncLoadingInitial: (state, action) => {
      return {
        ...state,
        initial: {
          ...state.initial,
          ...action.payload,
        },
      };
    },
    // All the reducers go here
    syncLoadAllMasterKey: (state, action) => {
      return {
        ...state,
        list: action.payload,
      };
    },
    syncInitMasterKey: (state, action) => {
      saveMasterKeys(action.payload);
      return {
        ...state,
        list: action.payload,
      };
    },
    syncCreateMasterKey: (state, action) => {
      return {
        ...state,
        list: _createMasterKey(action.payload, state.list),
      };
    },
    syncSwitchMasterKey: (state, action) => {
      return {
        ...state,
        list: switchMasterKey(action.payload, state.list),
      };
    },
    syncRemoveMasterKey: (state, action) => {
      return {
        ...state,
        list: removeMasterKey(action.payload, state.list),
      };
    },
    syncUpdateMasterKey: (state, action) => {
      return {
        ...state,
        list: updateMasterKey(action.payload, state.list),
      };
    },
    syncLoadAllAccounts: (state, action) => {
      return {
        ...state,
        accounts: action.payload,
      };
    },
    syncLoadingAllAccounts: (state, action) => {
      return {
        ...state,
        loadingAll: action.payload,
      };
    },
    syncAccountRemoveByPrivateKey: (state, action) => {
      const {accounts: oldAccounts} = state;
      const privateKey = action?.data;
      const accounts = oldAccounts.filter(
        account => account?.PrivateKey !== privateKey,
      );
      return {
        ...state,
        accounts,
      };
    },
  },
});

export const syncLoadingInitial = (masterKey: any) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncLoadingInitial(masterKey),
  );
  return masterKey;
};

export const syncLoadAllMasterKey = (masterKey: any) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncLoadAllMasterKey(masterKey),
  );
  return masterKey;
};

export const syncInitMasterKey = (masterKey: any) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncInitMasterKey(masterKey),
  );
  return masterKey;
};

export const syncCreateMasterKey = (masterKey: any) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncCreateMasterKey(masterKey),
  );
  return masterKey;
};

export const syncSwitchMasterKey = (masterKey: any) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncSwitchMasterKey(masterKey),
  );
  return masterKey;
};

export const syncRemoveMasterKey = (masterKey: any) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncRemoveMasterKey(masterKey),
  );
  return masterKey;
};

export const syncUpdateMasterKey = (masterKey: any) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncUpdateMasterKey(masterKey),
  );
  return masterKey;
};

export const syncAccountRemoveByPrivateKey = (privateKey: string) => {
  StoreService?.current?.dispatch(
    masterKeySlice.actions.syncAccountRemoveByPrivateKey(privateKey),
  );
  return privateKey;
};
