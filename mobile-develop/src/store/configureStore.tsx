import {
  Action,
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
  Reducer,
  ReducersMapObject,
} from 'redux';
import {Store} from '@reduxjs/toolkit';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistReducer, persistStore} from 'redux-persist';
import ReduxStorage from './ReduxStorage';
import reactotron from '../../ReactotronConfig';

interface CreateReducerManager {
  add: (key: string, reducer: Reducer) => void;
  adds: (reducers: {[x: string]: Reducer<any, Action<any>>}) => void;
}

const middlewares: any[] = [
  // reactotron.createEnhancer()
];

const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

interface CustomStore extends Store {
  reducerManager: CreateReducerManager;
  persistor: any;
  asyncReducers: ReducersMapObject;
}

function createReducer(asyncReducers: ReducersMapObject) {
  return combineReducers({
    ...asyncReducers,
  });
}

export function configureStore(
  initReducers: ReducersMapObject,
  persists = [] as string[],
) {
  const initReducer = createReducer(initReducers);

  const persistConfig = {
    key: 'root',
    whitelist: persists || [], // if you want to persist something, put it here
    storage: ReduxStorage,
  };

  const rootReducer: typeof initReducer = (
    state: ReturnType<typeof initReducer>,
    action: AnyAction,
  ) => {
    if (action.type === 'RESET_STORE') {
      return initReducer(undefined, action);
    }
    return initReducer(state, action);
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  // Create a store with the root reducer function being the one exposed by the manager.
  const store: CustomStore = createStore(persistedReducer, enhancer);
  // all reducer in here
  store.asyncReducers = {
    ...initReducers,
  };

  const persistor = persistStore(store, {});

  store.reducerManager = {
    add: (key, newReducer) => {
      store.asyncReducers[key] = newReducer;

      const _initReducer = createReducer(store.asyncReducers);
      const rootReducer: typeof _initReducer = (
        state: ReturnType<typeof _initReducer>,
        action: AnyAction,
      ) => {
        if (action.type === 'RESET_STORE') {
          return _initReducer(undefined, action);
        }
        return _initReducer(state, action);
      };

      // Generate a new combined reducer
      const newCombinedReducer = persistReducer(persistConfig, rootReducer);
      store.replaceReducer(newCombinedReducer);
      return newCombinedReducer;
    },
    adds: newReducer => {
      const keys = Object.keys(newReducer);
      for (let i = 0; i < keys.length; i++) {
        const _key = keys[i];
        store.asyncReducers[_key] = newReducer[_key];
      }
      const _initReducer = createReducer(store.asyncReducers);
      const rootReducer: typeof _initReducer = (
        state: ReturnType<typeof _initReducer>,
        action: AnyAction,
      ) => {
        if (action.type === 'RESET_STORE') {
          return _initReducer(undefined, action);
        }
        return _initReducer(state, action);
      };

      // Generate a new combined reducer
      const newCombinedReducer = persistReducer(persistConfig, rootReducer);
      store.replaceReducer(newCombinedReducer);
      store.persistor.persist();
      return newCombinedReducer;
    },
  };

  store.persistor = persistor;

  return {store, persistor};
}

/**

 To add a new reducer, one can now call store.reducerManager.add("asyncState", asyncReducer).

 To add a new reducers, one can now call

 const combineReducers = store.reducerManager.adds({"asyncState": asyncReducer});

 To remove a reducer, one can now call store.reducerManager.remove("asyncState")

 **/
