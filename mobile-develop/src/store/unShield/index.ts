import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';
import {CONSTANT_KEYS} from '@src/constants';
import isArray from 'lodash/isArray';

const initialState = {
  storage: {
    [CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED]: {
      txs: [],
    },
    [CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED]: {
      txs: [],
    },
  },
};

export const unShieldSlice = createSlice({
  name: 'unShield',
  initialState: initialState,
  reducers: {
    // All the reducers go here
    addStorageDataDecentralized: (state, action) => {
      const {keySave, tx} = action.payload;
      const storage = state?.storage[keySave];
      const {txs} = storage;
      if (!isArray(txs) || !tx) {
        return state;
      }
      if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED) {
        return {
          ...state,
          storage: {
            ...state?.storage,
            [keySave]: {
              ...storage,
              txs: [...txs, tx],
            },
          },
        };
      }
      return state;
    },
    removeStorageDataDecentralized: (state, action) => {
      const {keySave, burningTxId} = action.payload;
      const storage = state?.storage[keySave];
      const {txs} = storage;
      if (!isArray(txs) || !burningTxId) {
        return state;
      }
      if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED) {
        return {
          ...state,
          storage: {
            ...state?.storage,
            [keySave]: {
              ...storage,
              txs: [...txs.filter(tx => tx?.burningTxId !== burningTxId)],
            },
          },
        };
      }
      return state;
    },
    addStorageDataCentralized: (state, action) => {
      const {keySave, tx} = action.payload;
      const storage = state?.storage[keySave];
      const {txs} = storage;
      if (!isArray(txs) || !tx) {
        return state;
      }
      if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED) {
        return {
          ...state,
          storage: {
            ...state?.storage,
            [keySave]: {
              ...storage,
              txs: [...txs, tx],
            },
          },
        };
      }
      return state;
    },
    removeStorageDataCentralized: (state, action) => {
      const {keySave, txId} = action.payload;
      const storage = state?.storage[keySave];
      const {txs} = storage;
      if (!isArray(txs) || !txId) {
        return state;
      }
      if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED) {
        return {
          ...state,
          storage: {
            ...state?.storage,
            [keySave]: {
              ...storage,
              txs: [...txs.filter(tx => tx?.txId !== txId)],
            },
          },
        };
      }
      return state;
    },
  },
});

export const addStorageDataDecentralized = ({
  keySave,
  tx,
}: {
  keySave: string;
  tx: any;
}) => {
  StoreService?.current?.dispatch(
    unShieldSlice.actions.addStorageDataDecentralized({keySave, tx}),
  );
};

export const removeStorageDataDecentralized = ({
  keySave,
  burningTxId,
}: {
  keySave: string;
  burningTxId: string;
}) => {
  StoreService?.current?.dispatch(
    unShieldSlice.actions.removeStorageDataDecentralized({
      keySave,
      burningTxId,
    }),
  );
};

export const addStorageDataCentralized = ({
  keySave,
  tx,
}: {
  keySave: string;
  tx: any;
}) => {
  StoreService?.current?.dispatch(
    unShieldSlice.actions.addStorageDataCentralized({keySave, tx}),
  );
};

export const removeStorageDataCentralized = ({
  keySave,
  txId,
}: {
  keySave: string;
  txId: string;
}) => {
  StoreService?.current?.dispatch(
    unShieldSlice.actions.removeStorageDataCentralized({keySave, txId}),
  );
};
