export interface CacheItem<T> {
  data: T;
  expiredTime: number;
}

export type CacheStore = Record<string, CacheItem<any>>;

export const caches: CacheStore = {};

export const KEYS = {
  PoolConfig: 'pool-configs',
  PoolUserData: (paymentAddress: string) => `pool-data-${paymentAddress}`,
  PoolHistory: (paymentAddress: string) => `pool-history-${paymentAddress}`,
  DAppAddress: 'dapp-address',
  FeatureConfigs: 'feature-configs',
  PDESTATE: 'pdestate',
  PDEX_HISTORY: 'history-pdex-trade',
  P_TOKEN: 'ptoken',
  P_CUSTOM_TOKEN: 'pcustomtoken',
};

/**
 * Cache data
 */
export function cache<T>(key: string, data: T, expiredTime: number): void {
  caches[key] = {
    data: data,
    expiredTime: new Date().getTime() + expiredTime,
  };
}

export const EXPIRED_TIME = 40000;

/**
 * Cache the result of a promise function
 */
export const cachePromise = async <T>(
  key: string,
  promiseFunc: () => Promise<T>,
  expiredTime = EXPIRED_TIME,
): Promise<T | null> => {
  const cachedData = getCache<T>(key);
  if (cachedData !== null) {
    return cachedData;
  }
  const data = await promiseFunc();
  if (data) {
    cache(key, data, expiredTime);
  }
  return data;
};

/**
 * Get cache data
 */
export function getCache<T>(key: string): T | null {
  const cacheData = caches[key];

  if (cacheData && cacheData.expiredTime > new Date().getTime()) {
    return cacheData.data;
  }

  return null;
}

/**
 * Clear a specific cache entry
 */
export const clearCache = (key: string): boolean => {
  if (!caches[key]) {
    return false;
  }
  return delete caches[key];
};

export const clearAllCaches = (): void => {
  Object.keys(caches).forEach(key => delete caches[key]);
};

export const clearWalletCaches = (): void => {
  Object.keys(caches).forEach(key => {
    if (key.includes(KEYS.PDEX_HISTORY)) {
      delete caches[key];
    }
  });
};
