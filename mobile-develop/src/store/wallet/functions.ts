import {configsWallet} from '@src/services/wallet/WalletService';
import {Validator} from 'incognito-chain-web-js/build/wallet';
import {currentMasterKeySelector} from '../masterKey/selectors';
import isEqual from 'react-fast-compare';
import {batch} from 'react-redux';
import {ExHandler} from '@src/services/exception';
import getStore from '../getStore';
import {setWallet} from '.';
import {setDefaultAccount, setListAccount, setAccount} from '../account';
import {getPTokenList} from '../token/functions';
import {actionLoadFollowBalance} from '../followList/functions';
import {walletSelector} from './selectors';
import AccountService from '@src/services/wallet/accountService';
import {updateMasterKey} from '../masterKey/common';
import {
  actionSetNFTTokenData,
  actionSetSignPublicKeyEncode,
} from '../account/functions';
import {actionSyncAccountMasterKey} from '../masterKey/functions';

export const reloadAccountList = async () => {
  const state = getStore().getState();
  const wallet = walletSelector(state);
  const masterKey = currentMasterKeySelector(state);
  if (!wallet) {
    return;
  }
  const accounts = await wallet.listAccount();
  updateMasterKey(masterKey);
  setListAccount(accounts);
  return accounts;
};

export const actionSubmitOTAKeyForListAccount = async wallet => {
  try {
    if (!wallet) {
      return;
    }
    const listAccount = await wallet.listAccount();
    if (!listAccount) {
      return;
    }
    const task = listAccount.map(account => {
      const accountWallet = AccountService.getAccount(account, wallet);
      if (!!accountWallet && accountWallet?.name) {
        return accountWallet.submitOTAKey();
      }
    });
    await Promise.all(task);
  } catch (error) {
    console.log('SUBMIT OTA KEY ERROR', error);
  }
};

export const actionRequestAirdropNFTForListAccount = async wallet => {
  try {
    if (!wallet) {
      return;
    }
    const listAccount = await wallet.listAccount();
    if (!listAccount) {
      return;
    }
    const task = listAccount.map(account => {
      const accountWallet = AccountService.getAccount(account, wallet);
      if (!!accountWallet && accountWallet?.name) {
        return accountWallet.requestAirdropNFT();
      }
    });
    await Promise.all(task);
  } catch (error) {
    console.log('REQUEST AIRDROP NFT ERROR', error);
  }
};

export const reloadWallet = async (accountName = '') => {
  let listAccount = [];
  new Validator('reloadWallet-accountName', accountName).string();
  const state = getStore().getState();
  const masterKey = currentMasterKeySelector(state);
  let wallet = masterKey.wallet;
  let defaultAccount;
  try {
    await configsWallet(wallet);
    if (wallet?.Name) {
      listAccount = await wallet.listAccount();
      defaultAccount =
        listAccount.find(item => isEqual(item?.accountName, accountName)) ||
        listAccount[0];
      if (!defaultAccount?.accountName) {
        throw new Error(`Can not get default account ${accountName}`);
      }
      batch(() => {
        setWallet(wallet);
        setListAccount(listAccount);
        setAccount(defaultAccount);
        setDefaultAccount(defaultAccount);
        getPTokenList();
      });
      setTimeout(() => {
        batch(async () => {
          actionLoadFollowBalance();
          await actionSetSignPublicKeyEncode();
          await actionSyncAccountMasterKey();
          await actionSetNFTTokenData();
        });
      }, 500);
    }
    return wallet;
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};
