import {createSelector} from 'reselect';
import {RootState} from '../getStore';

export const modalSelector = (state: RootState) => state.modal;

export const modalLoadingSelector = createSelector(
  modalSelector,
  modal => modal.loading,
);
