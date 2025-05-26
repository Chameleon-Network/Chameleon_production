import {Platform, Text, TextStyle} from 'react-native';
import {camelCase} from 'lodash';

import _ from 'lodash';
import {Linking} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import knownCode from '@src/services/exception/customError/code/knownCode';
import CustomError from '@src/services/exception/customError/customError';
const timer = require('react-native-timer');

// Re-export from separate files to avoid circular dependencies
export {sleep} from './sleep';
export {isIOS} from './platform';

const chars = 'abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890';
const TAG = 'Util';

export const setCustomText = (customProps: {style: TextStyle}) => {
  // @ts-ignore
  const TextRender = Text.render;
  // @ts-ignore
  const initialDefaultProps = Text.defaultProps || {};
  // @ts-ignore
  Text.defaultProps = {
    // minimumFontScale: 1,
    maxFontSizeMultiplier: 1.3,
    allowFontScaling: false,
    ...initialDefaultProps,
    ...customProps,
  };

  // @ts-ignore
  Text.render = function render(props) {
    let oldProps = props;
    // @ts-ignore
    props = {...props, style: [customProps.style || {}, props.style]};
    try {
      return TextRender.apply(this, arguments);
    } finally {
      props = oldProps;
    }
  };
};

export const toBoolean = (value: any) => {
  return value === '0' ? false : !!value;
};

export const camelCaseKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelCaseKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelCaseKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

export const getIconLinkWithSymbol = (symbol = ''): string => {
  return `./node_modules/cryptocurrency-icons/32@2x/color/${_.toLower(
    symbol,
  )}@2x.png`;
};

export const resetRoute = (
  navigation: any,
  routeName: string,
  params: Record<string, any> = {},
): void => {
  // Note: This function relies on react-navigation which needs to be installed
  // and properly typed. Using any type for now.
  const resetAction = {
    index: 0,
    key: null,
    actions: [{routeName, params, type: 'Navigation/NAVIGATE'}],
  };

  navigation.dispatch(resetAction);
};

export const hashCode = (str: string): number => {
  return str
    .split('')
    .reduce(
      (prevHash: number, currVal: string) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    );
};

export const phoneInfo = (): string => {
  try {
    return `${DeviceInfo.getBrand()}-${DeviceInfo.getSystemVersion()}`;
  } catch (error) {
    return '';
  }
};

export const openSetting = async (
  sessionName = '',
  isOpenSettingDefault = true,
): Promise<boolean> => {
  try {
    const isSupported = await Linking.canOpenURL(
      `app-settings://${sessionName}`,
    );
    if (isSupported) {
      Linking.openURL(`app-settings://${sessionName}`);
    } else if (isOpenSettingDefault) {
      Linking.openURL('app-settings:');
    }
    return Promise.resolve(isSupported);
  } catch (error) {
    return Promise.reject('error');
  }
};

export const currentDateString = (): string => {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  } catch (error) {
    console.log(TAG, ' currentDateString error');
  }
  return '';
};

export const delay = (timeSecond: number): Promise<void> =>
  new Promise(res => setTimeout(() => res(), timeSecond * 1000));

export const makeCancelable = <T>(
  promise: Promise<T>,
): {promise: Promise<T>; cancel: () => void} => {
  let rejectFn: (reason?: any) => void;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    rejectFn = reject;

    Promise.resolve(promise).then(resolve).catch(reject);
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      rejectFn({canceled: true});
    },
  };
};

export const isEmailValid = (email: string): boolean => {
  // eslint-disable-next-line no-useless-escape
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
};

export const isNumber = (n: string | number): boolean => {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(String(n));
};

export const timeout = <T>(fn: T, timeSecond = 1): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn), timeSecond * 1000);
  });
};

export const until = async (fn: () => boolean): Promise<void> => {
  while (!fn()) {
    await delay(0);
  }
};

/**
 * @param promiseFunc - promiseFunc will be retried when return Error object.
 * @param count - default 6
 * @param delayToTry - default 1 second
 */
export const tryAtMost = async <T>(
  promiseFunc: () => Promise<T>,
  count = 6,
  delayToTry = 1,
): Promise<T> => {
  if (count > 0 && promiseFunc) {
    const result = await promiseFunc().catch(e => e);
    console.log(
      `tryAtMost result = ${result}, count = ${count}---isEROR = ${
        result instanceof Error
      }`,
    );
    if (result instanceof Error) {
      if (_.isNumber(delayToTry)) {
        await delay(delayToTry);
      }
      return await tryAtMost(promiseFunc, count - 1, delayToTry);
    }
    return result;
  }
  return Promise.reject(`Tried ${count} times and failed`);
};

export const createRandomString = (length?: number): string => {
  const pwd = _.sampleSize(chars, length || 12); // lodash v4: use _.sampleSize
  return pwd.join('');
};

/**
 * @param promiseObj
 * @param timeSecond - default 1
 */
export const excuteWithTimeout = <T>(
  promiseObj: Promise<T>,
  timeSecond = 1,
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const ss = createRandomString(10);
    timer.setTimeout(
      ss,
      function () {
        reject(
          new CustomError(knownCode.timeout_promise, {
            message: 'timeout ' + ss,
          }),
        );
        timer.clearTimeout(ss);
      },
      timeSecond * 1000,
    );

    const resolveWrap = (data?: T): void => {
      timer?.clearTimeout(ss);
      resolve(data as T);
    };

    const rejectWrap = (error?: any): void => {
      timer?.clearTimeout(ss);
      reject(error);
    };

    promiseObj.then(resolveWrap, rejectWrap);
  });
};
