import {StateStorage} from 'zustand/middleware';

const MMKVS = require('react-native-mmkv');
// @ts-ignore
import cryptoJS from 'crypto-js';
const KEY_HASH = 'com.incognito.wallet.SharedPreferences';

export const storage = MMKVS ? new MMKVS.MMKV() : null;

export const StorageMMKV: StateStorage = {
  setItem: (name, value) => {
    if (!storage) {
      return;
    }
    try {
      const encrypt = cryptoJS.AES.encrypt(value, KEY_HASH).toString();
      return storage.set(name, encrypt.toString());
    } catch (error) {
      console.log('error set MMKV ', name, error);
    }
    return storage.set(name, value);
  },
  getItem: name => {
    if (!storage) {
      return;
    }
    // get value
    const value = storage.getString(name);
    try {
      // decrypt value
      const bytes = cryptoJS.AES.decrypt(value, KEY_HASH).toString(
        cryptoJS.enc.Utf8,
      );
      return bytes.toString();
    } catch (error) {
      return value || null;
    }
  },
  removeItem: name => {
    if (!storage) {
      return;
    }
    return storage.delete(name);
  },
};
