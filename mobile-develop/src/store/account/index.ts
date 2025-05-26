import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _, {cloneDeep} from 'lodash';
import {StoreService} from '..';
import {AccountData} from '@src/models/account';

interface AccountState {
  list: AccountData[];
  defaultAccountName: string;
  isGettingBalance: string[];
  switch: boolean;
  create: boolean;
  import: boolean;
  signPublicKeyEncode: string;
  burnerAddress: string;
  isFetchingNFT: boolean;
  toggleModalMintMoreNFT: boolean;
  nft: {
    nftToken: string;
    initNFTToken: boolean;
    list: any[];
  };
}

const initialState: AccountState = {
  list: [],
  defaultAccountName: '',
  isGettingBalance: [],
  switch: false,
  create: false,
  import: false,
  signPublicKeyEncode: '',
  burnerAddress: '',
  isFetchingNFT: false,
  toggleModalMintMoreNFT: false,
  nft: {
    nftToken: '',
    initNFTToken: true,
    list: [],
  },
};

const _setAccount = (list: AccountData[], account: AccountData) => {
  let newList = [...list];
  try {
    const foundIndex = list.findIndex(
      a => a.PaymentAddress === account.PaymentAddress,
    );
    if (foundIndex >= 0) {
      newList[foundIndex] = account;
    }
  } catch (e) {
    console.error(e);
  }
  return newList;
};

const _removeByPrivateKey = (list: any, privateKey: any) => {
  const newList = [...list];
  try {
    _.remove(newList, _item => _item.PrivateKey === privateKey);
  } catch (e) {
    console.error(e);
  }
  return newList;
};

const _setGettingBalance = (list: any, accountName: any) => {
  const newList = [...list];
  return newList.includes(accountName) ? newList : [...newList, accountName];
};

const _removeGettingBalance = (list: any, accountName: any) => {
  const newList = [...list];
  _.remove(newList, item => item === accountName);
  return newList;
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<AccountData>) => {
      const newList = _setAccount(state.list, action.payload);
      return {
        ...state,
        list: newList,
      };
    },
    setList: (state, action: PayloadAction<AccountData[]>) => {
      return {
        ...state,
        list: cloneDeep(action.payload),
      };
    },
    removeByPrivateKey: (state, action: PayloadAction<string>) => {
      const newList = _removeByPrivateKey(state.list, action.payload);
      return {
        ...state,
        list: newList,
      };
    },
    getBalance: (state, action: PayloadAction<string>) => {
      const newList = _setGettingBalance(
        state.isGettingBalance,
        action.payload,
      );
      return {
        ...state,
        isGettingBalance: newList,
      };
    },
    getBalanceFinish: (state, action: PayloadAction<string>) => {
      const newList = _removeGettingBalance(
        state.isGettingBalance,
        action.payload,
      );
      return {
        ...state,
        isGettingBalance: newList,
      };
    },
    setDefaultAccount: (state, action: PayloadAction<{name: string}>) => {
      return {
        ...state,
        defaultAccountName: action.payload.name,
      };
    },
    setSwitchAccount: (state, action) => {
      return {
        ...state,
        switch: action.payload,
      };
    },
    setCreateAccount: (state, action) => {
      return {
        ...state,
        create: action.payload,
      };
    },
    setImportAccount: (state, action) => {
      return {
        ...state,
        import: action.payload,
      };
    },
    setSignPublicKeyEncode: (state, action) => {
      const {signPublicKeyEncode} = action.payload;
      return {
        ...state,
        signPublicKeyEncode,
      };
    },
    getBurnedAddress: (state, action) => {
      return {
        ...state,
        burnerAddress: action.payload,
      };
    },
    toggleModalMintMoreNFT: (state, action) => {
      return {
        ...state,
        toggleModalMintMoreNFT: action.payload,
      };
    },
    fetchedNFT: (state, action) => {
      return {
        ...state,
        nft: {...action.payload},
        isFetchingNFT: false,
      };
    },
    fetchingNFT: (state, action) => {
      return {
        ...state,
        isFetchingNFT: action.payload,
      };
    },

    reset: () => initialState,
  },
});

export const setAccount = (account: any) => {
  StoreService?.current?.dispatch(accountSlice.actions.set(account));
  return account;
};

export const setListAccount = (accounts: any[]) => {
  StoreService?.current?.dispatch(accountSlice.actions.setList(accounts));
  return accounts;
};

export const removeAccountByPrivateKey = (privateKey: string) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.removeByPrivateKey(privateKey),
  );
  return privateKey;
};

export const getBalance = (accountName: string) => {
  StoreService?.current?.dispatch(accountSlice.actions.getBalance(accountName));
  return accountName;
};

export const getBalanceFinish = (accountName: string) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.getBalanceFinish(accountName),
  );
  return accountName;
};

export const setDefaultAccount = (accountName: string) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.setDefaultAccount({name: accountName}),
  );
  return accountName;
};

export const setSwitchAccount = (isSwitching: boolean) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.setSwitchAccount(isSwitching),
  );
  return isSwitching;
};

export const setCreateAccount = (isCreating: boolean) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.setCreateAccount(isCreating),
  );
  return isCreating;
};

export const setImportAccount = (isImporting: boolean) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.setImportAccount(isImporting),
  );
  return isImporting;
};

export const setSignPublicKeyEncode = (signPublicKeyEncode: string) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.setSignPublicKeyEncode({signPublicKeyEncode}),
  );
  return signPublicKeyEncode;
};

export const getBurnedAddress = (burnerAddress: string) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.getBurnedAddress(burnerAddress),
  );
  return burnerAddress;
};

export const toggleModalMintMoreNFT = (isOpen: boolean) => {
  StoreService?.current?.dispatch(
    accountSlice.actions.toggleModalMintMoreNFT(isOpen),
  );
  return isOpen;
};

export const resetAccount = () => {
  StoreService?.current?.dispatch(accountSlice.actions.reset());
};

export const fetchedNFT = (nft: any) => {
  StoreService?.current?.dispatch(accountSlice.actions.fetchedNFT(nft));
  return nft;
};
export const fetchingNFT = () => {
  StoreService?.current?.dispatch(accountSlice.actions.fetchingNFT());
  return;
};
