import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';
import {CONSTANT_KEYS} from '@src/constants';
import {isReceiverExist} from './utils';
import {isEqual, toLower} from 'lodash';

const initialState = {
  [CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK]: {
    receivers: [],
    sync: false,
    migrateIncognitoAddress: false,
  },
  [CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK]: {
    receivers: [],
  },
  selected: null,
};

export const receiversSlice = createSlice({
  name: 'receivers', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    // All the reducers go here
    create: (state, action) => {
      const {keySave, receiver} = action.payload;
      const oldReceivers = state[keySave].receivers;
      const exist = isReceiverExist(oldReceivers, receiver);
      if (exist) {
        throw new Error('User exist!');
      }
      return {
        ...state,
        [keySave]: {
          ...state[keySave],
          receivers: [
            ...oldReceivers,
            {
              ...receiver,
              createdAt: new Date().getTime(),
              updatedAt: null,
            },
          ],
        },
      };
    },
    update: (state, action) => {
      const {keySave, receiver} = action.payload;
      const oldReceivers = state[keySave].receivers;
      const isNameExisted = oldReceivers
        .filter(item => item?.address !== receiver?.address)
        .some(item => isEqual(toLower(item?.name), toLower(receiver?.name)));
      if (isNameExisted) {
        throw new Error('Name is existed!');
      }
      return {
        ...state,
        [keySave]: {
          ...state[keySave],
          receivers: [
            ...oldReceivers.map(item =>
              item.address === receiver.address
                ? {
                    ...item,
                    name: receiver?.name || item?.name,
                    updatedAt: new Date().getTime(),
                    rootNetworkName:
                      receiver?.rootNetworkName || item?.rootNetworkName,
                  }
                : item,
            ),
          ],
        },
      };
    },
    delete: (state, action) => {
      const {keySave, receiver} = action.payload;
      const {address} = receiver;
      const oldReceivers = state[keySave].receivers;
      const exist = isReceiverExist(oldReceivers, receiver);
      if (!exist) {
        return state;
      }
      return {
        ...state,
        [keySave]: {
          ...state[keySave],
          receivers: [
            ...oldReceivers.filter(item => item?.address !== address),
          ],
        },
      };
    },
    updateRecently: (state, action) => {
      const {keySave, receiver} = action.payload;
      const oldReceivers = state[keySave].receivers;
      const exist = oldReceivers.some(
        item => item?.address === receiver.address,
      );
      if (!exist) {
        return state;
      }
      return {
        ...state,
        [keySave]: {
          ...state[keySave],
          receivers: [
            ...oldReceivers.map(item =>
              item.address === receiver.address
                ? {...item, recently: new Date().getTime()}
                : item,
            ),
          ],
        },
      };
    },
    deleteAll: (state, action) => {
      const {keySave} = action.payload;
      return {
        ...state,
        [keySave]: {
          ...state[keySave],
          receivers: [],
        },
      };
    },
    syncSuccess: (state, action) => {
      const {keySave} = action.payload;
      return {
        ...state,
        [keySave]: {
          ...state[keySave],
          sync: true,
        },
      };
    },
    migrateIncognitoAddress: (state, action) => {
      const keySave = CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK;
      return {
        ...state,
        [keySave]: {
          ...state[keySave],
          migrateIncognitoAddress: true,
        },
      };
    },
    selectedReceiver: (state, action) => {
      const {address, keySave} = action.payload;
      const {receivers} = state[keySave];
      const selected = receivers?.find(
        receiver => receiver?.address === address,
      );
      return {
        ...state,
        selected: {...selected, keySave},
      };
    },
    removeSelectedReceiver: state => {
      return {
        ...state,
        selected: null,
      };
    },
  },
});

export const createReceiver = (payload: {receiver: any; keySave: string}) => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.create(payload),
  );
};

export const updateReceiver = (payload: {receiver: any; keySave: string}) => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.update(payload),
  );
};

export const updateRecentlyReceiver = (payload: {
  receiver: any;
  keySave: string;
}) => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.updateRecently(payload),
  );
};

export const deleteReceiver = (payload: {receiver: any; keySave: string}) => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.delete(payload),
  );
};

export const deleteAllReceivers = (payload: {keySave: string}) => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.deleteAll(payload),
  );
};

export const syncSuccessReceivers = (payload: {keySave: string}) => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.syncSuccess(payload),
  );
};

export const migrateIncognitoAddressReceivers = () => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.migrateIncognitoAddress(),
  );
};

export const selectedReceiver = (payload: {
  address: string;
  keySave: string;
}) => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.selectedReceiver(payload),
  );
};

export const removeSelectedReceiver = () => {
  return StoreService?.current?.dispatch(
    receiversSlice.actions.removeSelectedReceiver(),
  );
};
