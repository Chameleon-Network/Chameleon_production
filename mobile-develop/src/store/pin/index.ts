import { createSlice } from '@reduxjs/toolkit';
import { StoreService } from '..';

const initialState = {
  loading: false,
  pin: '',
  authen: false,
  waiting: false,
};

export const pinSlice = createSlice({
  name: 'pin',
  initialState,
  reducers: {
    authen: (state, action) => {
      return { ...state, authen: true };
    },
    loading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    update: (state, action) => {
      return {
        ...state,
        pin: action.payload,
        authen: false,
      };
    },
    delete: (state, action) => {
      return {
        ...state,
        pin: '',
      };
    },
    waiting: (state, action) => {
      return {
        ...state,
        waiting: action.payload,
      };
    },
  },
});

export const authenPin = () => {
  return StoreService?.current?.dispatch(pinSlice.actions.authen());
};

export const loadingPin = (data: boolean) => {
  StoreService?.current?.dispatch(pinSlice.actions.loading(data));
  return data;
};

export const syncPin = (pin: string) => {
  StoreService?.current?.dispatch(pinSlice.actions.update(pin));
  return pin;
};

export const deletePin = () => {
  return StoreService?.current?.dispatch(pinSlice.actions.delete());
};

export const setWaitingPin = (data: boolean) => {
  return StoreService?.current?.dispatch(pinSlice.actions.waiting(data));
};
