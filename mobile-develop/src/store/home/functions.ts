import {CONSTANT_CONFIGS} from '@src/constants';
import {syncAppVersion} from '.';

import axios from 'axios';
import {checkOutdatedVersion} from './utils';

export const apiGetHomeConfigs = () =>
  axios.get(CONSTANT_CONFIGS.HOME_CONFIG_DATA);

export const apiGetAppVersion = async () =>
  axios.get(CONSTANT_CONFIGS.APP_VERSION);

export const requestFetchHome = async () => {
  let appVersion;
  let outdatedVersion = false;
  try {
    const {data: appVersionDt} = await axios.get(CONSTANT_CONFIGS.APP_VERSION);
    appVersion = appVersionDt?.Result;
    if (appVersion && appVersion?.Version) {
      outdatedVersion = checkOutdatedVersion(appVersion?.Version);
    }
  } catch (error) {
    console.debug('error', error);
  } finally {
    const _appVersionResponse = {...appVersion, outdatedVersion};
    syncAppVersion({appVersion: _appVersionResponse});
  }
};
