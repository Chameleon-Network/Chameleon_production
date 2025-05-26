import {
  addStorageDataCentralized,
  addStorageDataDecentralized,
  removeStorageDataCentralized,
  removeStorageDataDecentralized,
} from '.';

export const actionAddStorageDataDecentralized = (
  payload = {keySave: '', tx: ''},
) => addStorageDataDecentralized(payload);

export const actionRemoveStorageDataDecentralized = (
  payload = {keySave: '', burningTxId: ''},
) => removeStorageDataDecentralized(payload);

export const actionAddStorageDataCentralized = (
  payload = {keySave: '', tx: ''},
) => addStorageDataCentralized(payload);

export const actionRemoveStorageDataCentralized = (
  payload = {keySave: '', txId: ''},
) => removeStorageDataCentralized(payload);
