/* eslint-disable import/no-cycle */
import {PrivacyVersion, Validator} from 'incognito-chain-web-js/build/wallet';
import accountService from '@src/services/wallet/accountService';
import {getPassphrase} from '@src/services/wallet/passwordService';
import AccountModel from '@src/models/account';
import {storeWalletAccountIdsOnAPI} from '@services/wallet/WalletService';
import {PRV} from '@src/constants/common';
import {ExHandler} from '@src/services/exception';
import MasterKeyModel from '@src/models/masterKey';
import {batch} from 'react-redux';
import uniq from 'lodash/uniq';
import {cachePromise} from '@src/services/cache';
import getStore from '../getStore';
import {walletSelector} from '../wallet/selectors';
import {
  currentMasterKeySelector,
  masterlessKeyChainSelector,
  noMasterLessSelector,
} from '../masterKey/selectors';
import {getDefaultAccountWalletSelector} from '../shared/selectors';
import {
  burnerAddressSelector,
  createAccountSelector,
  defaultAccountNameSelector,
  defaultAccountSelector,
  getAccountByName,
  importAccountSelector,
  listAccount,
} from './selectors';
import {
  removeAccountByPrivateKey,
  setAccount,
  setSignPublicKeyEncode,
  setCreateAccount,
  setImportAccount,
  fetchedNFT,
  toggleModalMintMoreNFT,
  getBurnedAddress,
  setSwitchAccount,
} from '.';
import {defaultPTokensIDsSelector} from '../token/selectors';
import {
  loadAllMasterKeyAccounts,
  loadAllMasterKeys,
  switchMasterKey,
} from '../masterKey/functions';
import {syncAccountRemoveByPrivateKey, syncUpdateMasterKey} from '../masterKey';
import {reloadWallet} from '../wallet/functions';
import {actionGetPDexV3Inst} from '../pdexV3/functions';
import {setTokenBalance} from '../followList';
import {setListToken, setToken} from '../token';
import {
  getBalance as getBalanceStart,
  getBalanceFinish,
  setDefaultAccount as setDefaultAccountAccount,
} from '.';

import {getBalance as getTokenBalance} from '../token/functions';

export const removeAccount = async account => {
  const state = getStore().getState();
  const wallet = walletSelector(state);
  console.time('TOTAL_TIME_REMOVE_ACCOUNT');
  try {
    try {
      accountService.removeCacheBalance(account, wallet);
    } catch {
      //
    }
    const {PrivateKey} = account;
    const masterKey = currentMasterKeySelector(state);
    const walletAccount = accountService.getAccount(account, wallet);
    const accountInfo = await walletAccount.getDeserializeInformation();
    if (!masterKey.deletedAccountIds) {
      masterKey.deletedAccountIds = [];
    }
    masterKey.deletedAccountIds.push(accountInfo.ID);
    wallet.deletedAccountIds = masterKey.deletedAccountIds;
    console.time('TIME_REMOVE_ACCOUNT');
    await accountService.removeAccount(PrivateKey, wallet);
    console.timeEnd('TIME_REMOVE_ACCOUNT');
    batch(() => {
      syncUpdateMasterKey(masterKey);
      removeAccountByPrivateKey(PrivateKey);
    });
    await reloadWallet();
    await loadAllMasterKeyAccounts();
    console.timeEnd('TOTAL_TIME_REMOVE_ACCOUNT');
    return true;
  } catch (e) {
    console.log('REMOVE ACCOUNT ERROR', e);
    throw e;
  }
};

export const actionSetSignPublicKeyEncode = async (defaultAccount?: any) => {
  try {
    const state = getStore().getState();
    const wallet = walletSelector(state);
    const account = defaultAccount || defaultAccountSelector(state);
    const signPublicKeyEncode = await accountService.getSignPublicKeyEncode({
      wallet,
      account,
    });
    if (signPublicKeyEncode) {
      setSignPublicKeyEncode(signPublicKeyEncode);
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionSetNFTTokenData = async (noCache = true) => {
  let nftPayload = {
    nftToken: '',
    nftTokenAvailable: '',
    initNFTToken: false,
    list: [],
    pending: false,
    listNFTToken: [],
  };
  try {
    //   dispatch(actionSetFetchingNFT());
    const pDexV3Inst = await actionGetPDexV3Inst();
    const otaKey = pDexV3Inst.getOTAKey();
    if (noCache) {
      nftPayload = await pDexV3Inst.getNFTTokenData({
        version: PrivacyVersion.ver2,
      });
    } else {
      nftPayload = await cachePromise(`${otaKey}-LIST-NFT-TOKEN-DATA`, () =>
        pDexV3Inst.getNFTTokenData({
          version: PrivacyVersion.ver2,
        }),
      );
    }
    fetchedNFT(nftPayload);
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
  return nftPayload;
};

export const setDefaultAccount = async account => {
  try {
    setDefaultAccountAccount(account);
  } catch (e) {
    new ExHandler(e).showErrorToast();
  } finally {
    accountService.saveDefaultAccountToStorage(
      accountService.getAccountName(account),
    );
  }
};

export const actionUpdateDefaultAccount = account => {
  setDefaultAccountAccount(account);
};

export const getBalance = async account => {
  let balance = 0;
  try {
    if (!account) throw new Error('Account object is required');
    const state = getStore().getState();
    getBalanceStart(account?.name);
    const wallet = walletSelector(state);
    if (!wallet) {
      throw new Error('Wallet is not exist');
    }
    balance = await accountService.getBalance({
      account,
      wallet,
      tokenID: PRV.id,
      version: PrivacyVersion.ver2,
    });
    const accountMerge = {
      ...account,
      value: balance,
    };
    const token = {
      id: PRV.id,
      amount: balance,
      loading: false,
    };
    setTokenBalance({token, OTAKey: account.OTAKey});
    setToken(token);
    setAccount(accountMerge);
  } catch (e) {
    account &&
      setAccount({
        ...account,
        value: null,
      });
    throw e;
  } finally {
    getBalanceFinish(account?.name);
  }
  return balance ?? 0;
};

export const reloadBalance = async () => {
  const state = getStore().getState();
  const account = defaultAccountSelector(state);
  await getBalance(account);
};

export const actionSwitchAccountFetching = () => setSwitchAccount(true);
export const actionSwitchAccountFetched = () => setSwitchAccount(false);
export const actionSwitchAccountFetchFail = () => setSwitchAccount(false);

export const actionSwitchAccount = async (
  accountName: string,
  shouldLoadBalance = true,
) => {
  try {
    new Validator('actionSwitchAccount-accountName', accountName)
      .required()
      .string();
    new Validator(
      'actionSwitchAccount-shouldLoadBalance',
      shouldLoadBalance,
    ).boolean();
    const state = getStore().getState();
    const account = getAccountByName(state)(accountName);
    const masterKey: MasterKeyModel = currentMasterKeySelector(state);
    const defaultAccountName = defaultAccountNameSelector(state);
    if (defaultAccountName !== account?.name) {
      switchMasterKey(masterKey?.name, accountName);
    }
    return account;
  } catch (error) {
    throw error;
  }
};

export const actionReloadFollowingToken = async () => {
  try {
    const state = getStore().getState();
    const wallet = walletSelector(state);
    const account = defaultAccountSelector(state);
    const accountWallet = getDefaultAccountWalletSelector(state);
    let followed = await accountService.getFollowingTokens(account, wallet);
    const keyInfo = await accountWallet.getKeyInfo({
      version: PrivacyVersion.ver2,
    });
    const isFollowedDefaultTokens =
      await accountWallet.isFollowedDefaultTokens();
    if (!isFollowedDefaultTokens) {
      const coinIDs = keyInfo.coinindex
        ? Object.keys(keyInfo.coinindex).map(tokenID => tokenID)
        : [];
      const pTokensIDs = defaultPTokensIDsSelector(state);
      if (pTokensIDs.length > 0) {
        let tokenIDs = [...pTokensIDs, ...coinIDs];
        tokenIDs = uniq(tokenIDs);
        await accountWallet.followingDefaultTokens({
          tokenIDs,
        });
        followed = await accountService.getFollowingTokens(account, wallet);
      }
    }
    batch(() => {
      getBalance(account);
      followed.forEach(token => {
        try {
          getTokenBalance(token?.id);
        } catch (error) {
          console.log('error', token?.id);
        }
      });
      setListToken(followed);
    });
    return followed;
  } catch (error) {
    throw error;
  }
};

export const actionLoadAllBalance = async () => {
  try {
    const state = getStore().getState();
    const accounts = listAccount(state);
    await Promise.all(accounts.map(async account => await getBalance(account)));
  } catch (error) {
    throw Error(error);
  }
};

export const actionFetchingCreateAccount = () => setCreateAccount(true);
export const actionFetchedCreateAccount = () => setCreateAccount(false);
export const actionFetchFailCreateAccount = () => setCreateAccount(false);

export const actionFetchCreateAccount = async ({
  accountName,
}: {
  accountName: string;
}) => {
  console.time('TOTAL_TIME_CREATE_ACCOUNT');
  const state = getStore().getState();
  const create = createAccountSelector(state);
  let wallet = walletSelector(state);
  const masterKey: MasterKeyModel = currentMasterKeySelector(state);
  let serializedAccount;
  if (!!create || !accountName || !wallet) {
    return;
  }
  try {
    actionFetchingCreateAccount();
    const account = await accountService.createAccount(accountName, wallet);
    serializedAccount = new AccountModel(
      accountService.toSerializedAccountObj(account),
    );
    storeWalletAccountIdsOnAPI(wallet);
    batch(() => {
      actionFetchedCreateAccount();
      if (serializedAccount?.name) {
        switchMasterKey(masterKey?.name, serializedAccount?.name);
        loadAllMasterKeys();
      }
    });
    console.timeEnd('TOTAL_TIME_CREATE_ACCOUNT');
    return serializedAccount;
  } catch (error) {
    actionFetchFailCreateAccount();
    throw error;
  }
};

export const actionFetchingImportAccount = () => setImportAccount(true);

export const actionFetchedImportAccount = () => setImportAccount(false);

export const actionFetchFailImportAccount = () => setImportAccount(false);

export const actionFetchImportAccount = async ({accountName, privateKey}) => {
  const state = getStore().getState();
  const importAccount = importAccountSelector(state);
  const masterless = masterlessKeyChainSelector(state);
  const masterKeys = noMasterLessSelector(state);
  let selectedMasterKey = masterless;
  if (!!importAccount || !accountName || !privateKey) {
    return;
  }
  try {
    actionFetchingImportAccount();
    for (const masterKey of masterKeys) {
      try {
        const isCreated = await masterKey.wallet.hasCreatedAccount(privateKey);
        if (isCreated) {
          selectedMasterKey = masterKey;
          break;
        }
      } catch (e) {
        console.debug('CHECK CREATED ERROR', e);
      }
    }
    let wallet = selectedMasterKey?.wallet;
    const isImported = await accountService.importAccount(
      privateKey,
      accountName,
      wallet,
    );
    if (isImported) {
      if (selectedMasterKey !== masterless) {
        storeWalletAccountIdsOnAPI(wallet);
      }
      batch(() => {
        switchMasterKey(selectedMasterKey?.name || '', accountName);
        actionFetchedImportAccount();
        loadAllMasterKeyAccounts();
      });
    } else {
      throw new Error('Import keychain error');
    }
    return isImported;
  } catch (error) {
    actionFetchFailImportAccount();
    throw error;
  }
};

export const actionFetchBurnerAddress = async () => {
  try {
    const state = getStore().getState();
    const burnerAddress = burnerAddressSelector(state);
    if (burnerAddress) {
      return;
    }
    const account = getDefaultAccountWalletSelector(state);
    const payload = await account.getBurnerAddress();
    getBurnedAddress(payload);
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }
};

export const actionFetchedNFT = payload => fetchedNFT(payload);

export const actionToggleModalMintMoreNFT = payload =>
  toggleModalMintMoreNFT(payload);
