import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

const initialState = {
  visible: false,
  data: null,
  shouldCloseModalWhenTapOverlay: false,
  loading: {
    toggle: false,
    title: '',
  },
};

export const modalSlice = createSlice({
  name: 'modal', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    toggleModal: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    toggleLoadingModal: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const toggleModal = payload => {
  return StoreService?.current?.dispatch(
    modalSlice.actions.toggleModal(payload),
  );
};

export const toggleLoadingModal = payload => {
  return StoreService?.current?.dispatch(
    modalSlice.actions.toggleLoadingModal(payload),
  );
};
