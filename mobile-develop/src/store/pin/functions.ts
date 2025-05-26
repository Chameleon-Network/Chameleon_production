import LocalDatabase from '@utils/LocalDatabase';
import { ExHandler } from '@src/services/exception';
import { loadingPin, syncPin } from '.';
import { convertUtils } from '@src/utils/convert';

export const loadPin = async () => {
  try {
    loadingPin(true);
    const pin = await LocalDatabase.getPIN();
    syncPin(pin);
    return pin;
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    loadingPin(false);
  }
};

export const updatePin = async (newPin: string) => {
  const hashPin = convertUtils.toHash(newPin);
  await LocalDatabase.savePIN(hashPin);
  syncPin(hashPin);
  return hashPin;
};
