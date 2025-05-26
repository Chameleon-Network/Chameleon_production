import {toBoolean} from '../../utils';
import {LanguageEnum} from '@src/dictionary/types';
import {globalStore} from './store';

export const isSuperApp = () => {
  return globalStore.store(state => toBoolean((state || {})['isSuperApp']));
};

export const useLanguage = () => {
  const localLanguage = globalStore.store(state => (state || {})['language']);
  return localLanguage || LanguageEnum.EN;
};

export const getCurrentLanguage = () => {
  const localLanguage = (globalStore.store.getState() || {})['language'];
  return localLanguage || LanguageEnum.EN;
};

export const useThemeName = () => {
  return globalStore.store(state => state.theme);
};

export const getThemeName = () => {
  return globalStore.store.getState().theme;
};

export const useSetting = (keyName: string) => {
  return globalStore.store(state => (state || {})[keyName]);
};

const SOCKET_STATE_GLOBAL_KEY = 'socketIsConnected';
const NETWORK_STATE_GLOBAL_KEY = 'networkIsConnected';

// for socket
export const setSocketIsConnected = (state: boolean) => {
  return globalStore.setSettingAction(SOCKET_STATE_GLOBAL_KEY, state);
};

export const useSocketIsConnected = () => {
  return globalStore.store(state => (state || {})[SOCKET_STATE_GLOBAL_KEY]);
};

export const getSocketIsConnected = () => {
  return globalStore.getSettingAction(SOCKET_STATE_GLOBAL_KEY);
};

// for network
export const setNetworkConnected = (state: boolean) => {
  return globalStore.setSettingAction(NETWORK_STATE_GLOBAL_KEY, state);
};

export const useNetworkConnected = () => {
  return globalStore.store(state => (state || {})[NETWORK_STATE_GLOBAL_KEY]);
};

export const getNetworkConnected = () => {
  return globalStore.getSettingAction(NETWORK_STATE_GLOBAL_KEY);
};
