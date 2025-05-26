import {configureStore} from './configureStore';
import {createRef} from 'react';

export const StoreService: any = createRef();

export const initCoreStore = (reducers: any, persists = [] as string[]) => {
  const {store, persistor} = configureStore(
    {
      ...(reducers || {}),
    },
    persists || [],
  );
  StoreService.current = store;
  return {store, persistor};
};

export * from './global/hooks';
export * from './global/store';
export * from './global/types';
