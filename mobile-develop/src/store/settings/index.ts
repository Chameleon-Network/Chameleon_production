import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';
import {VIDEOS_LIST} from '@src/constants';

const initialState = {
  data: [],
  error: null,
  videos: VIDEOS_LIST,
  newUserTutorial: false,
  codepushVersion: '',
};

export const settingsSlice = createSlice({
  name: 'settings', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    syncSettings: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    setVideoTutorial: (state, action) => {
      return {
        ...state,
        videos: action.payload || [],
      };
    },
    setCodePushVersion: (state, action) => {
      return {
        ...state,
        codepushVersion: action.payload,
      };
    },
    setNewUserTutorial: (state, action) => {
      return {
        ...state,
        newUserTutorial: action.payload,
      };
    },
  },
});

export const syncSettings = (payload: any) => {
  StoreService?.current?.dispatch(settingsSlice.actions.syncSettings(payload));
};

export const setVideoTutorial = (payload: any) => {
  StoreService?.current?.dispatch(
    settingsSlice.actions.setVideoTutorial(payload),
  );
};

export const setCodePushVersion = (payload: any) => {
  StoreService?.current?.dispatch(
    settingsSlice.actions.setCodePushVersion(payload),
  );
};

export const setNewUserTutorial = (payload: any) => {
  StoreService?.current?.dispatch(
    settingsSlice.actions.setNewUserTutorial(payload),
  );
};
