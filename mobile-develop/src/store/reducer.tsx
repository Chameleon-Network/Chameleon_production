import {accountSlice} from './account';
import {followListSlice} from './followList';
import {getStartedSlice} from './getStarted';
import {masterKeySlice} from './masterKey';
import {modalSlice} from './modal';
import {newsSlice} from './news';
import {pairlistSlice} from './pairlist';
import {pdexV3Reducer} from './pdexV3';
import {pinSlice} from './pin';
import {profileSlice} from './profile';
import {refillPRVSplice} from './refillPRV';
import {selectedPrivacySlice} from './selectedPrivacy';
import {settingSlice} from './setting';
import {settingsSlice} from './settings';
import {streamlineSlice} from './streamline';
import {tabsSlice} from './tabs';
import {tokenSlice} from './token';
import {unShieldSlice} from './unShield';
import {walletSlice} from './wallet';
import {convertToUnifiedTokenSlice} from './convertToUnifiedToken';
import {shieldSlice} from './shield';
import {homeSlice} from './home';
import {notificationSlice} from './notification';
import {combineReducers} from '@reduxjs/toolkit';
import {historySlice} from './history';
import {childSelectedPrivacySlice} from './childSelectedPrivacy';
import {receiversSlice} from './receivers';

export const reducers = {
  account: accountSlice.reducer,
  convertToUnifiedToken: convertToUnifiedTokenSlice.reducer,
  followWallet: followListSlice.reducer,
  getStarted: getStartedSlice.reducer,
  home: homeSlice.reducer,
  masterKey: masterKeySlice.reducer,
  modal: modalSlice.reducer,
  news: newsSlice.reducer,
  notification: notificationSlice.reducer,
  pairlist: pairlistSlice.reducer,
  pDexV3: pdexV3Reducer,
  pin: pinSlice.reducer,
  profile: profileSlice.reducer,
  refillPRV: refillPRVSplice.reducer,
  selectedPrivacy: selectedPrivacySlice.reducer,
  setting: settingSlice.reducer,
  settings: settingsSlice.reducer,
  shield: shieldSlice.reducer,
  streamline: streamlineSlice.reducer,
  tabs: tabsSlice.reducer,
  token: tokenSlice.reducer,
  unShield: unShieldSlice.reducer,
  wallet: walletSlice.reducer,
  history: historySlice.reducer,
  childSelectedPrivacy: childSelectedPrivacySlice.reducer,
  receivers: receiversSlice.reducer,
};

// Create a root reducer to be used by the configureStore
export const rootReducer = combineReducers(reducers);
