import {storage} from '../storage';
import {getPassphrase} from './passwordService';

/**
 * Saves wallet to storage
 * @param wallet Wallet instance to save
 */
export async function saveWallet(wallet) {
  const {aesKey} = await getPassphrase();
  wallet.Storage = storage;
  wallet.save(aesKey);
}

/**
 * Loads list of accounts with BLS public key from wallet
 * @param wallet Wallet instance
 * @returns [{{string} AccountName, {string} BLSPublicKey, {int} Index}]
 */
export async function loadListAccountWithBLSPubKey(wallet) {
  try {
    const listAccountRaw = (await wallet.listAccountWithBLSPubKey()) || [];
    return listAccountRaw;
  } catch (e) {
    throw e;
  }
}
