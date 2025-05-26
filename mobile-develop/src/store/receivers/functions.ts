import {
  createReceiver,
  deleteAllReceivers,
  deleteReceiver,
  migrateIncognitoAddressReceivers,
  removeSelectedReceiver,
  selectedReceiver,
  syncSuccessReceivers,
  updateReceiver,
  updateRecentlyReceiver,
} from '.';

const initPayload = {
  keySave: '',
  receiver: {
    address: '',
    name: '',
    networkName: '',
    rootNetworkName: '',
  },
};

export const actionCreate = (payload = initPayload) => createReceiver(payload);

export const actionUpdate = (payload = initPayload) => updateReceiver(payload);

export const actionDelete = (payload = initPayload) => deleteReceiver(payload);

export const actionUpdateRecently = (payload = initPayload) =>
  updateRecentlyReceiver(payload);

export const actionDeleteAll = (payload = initPayload) =>
  deleteAllReceivers(payload);

export const actionSyncSuccess = payload => syncSuccessReceivers(payload);

export const actionMigrateIncognitoAddress = payload =>
  migrateIncognitoAddressReceivers(payload);

export const actionSelectedReceiver = payload => selectedReceiver(payload);

export const actionRemoveSelectedReceiver = () => removeSelectedReceiver();
