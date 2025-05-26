import {create} from 'zustand';
import {GlobalState} from './types';
import {LanguageEnum} from '@src/dictionary/types';
import {ThemeNameEnum} from '@src/types';

const _globalStore = create<GlobalState>((set, get) => ({
  theme: ThemeNameEnum.WHITE,
}));

const setThemeAction = theme => {
  _globalStore.setState({theme: theme});
};

const getCurrentTheme = () => {
  return _globalStore.getState().theme;
};

const setSettingAction = (keyName: string, value: any) => {
  _globalStore.setState({[keyName]: value});
};

const getSettingAction = (keyName: string) => {
  return (_globalStore.getState() || {})[keyName] || '';
};

const useSettingAction = (keyName: string) => {
  return _globalStore(state => state[keyName] || '');
};

const resetGlobalStore = () => {
  _globalStore.setState(state => {
    const _theme = state.theme;
    const _networkIsConnected = state.networkIsConnected;
    Object.keys(state).forEach(key => {
      delete state[key];
    });
    state.theme = _theme;
    state.networkIsConnected = _networkIsConnected;
    return state;
  });
  return;
};

export const globalStore = {
  store: _globalStore,
  setThemeAction,
  getCurrentTheme,
  setSettingAction,
  getSettingAction,
  useSettingAction,
  resetGlobalStore,
};
