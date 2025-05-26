import {combineReducers} from '@reduxjs/toolkit';
import {useSelector as _useSelector} from 'react-redux';
import {getStore as getStoreInstance, setStore as setStoreInstance, RootState} from './types';

// Re-export for backwards compatibility
export const getStore = getStoreInstance;
export const setStore = setStoreInstance;
export type {RootState};

interface UseSelector {
  <TState = RootState, Selected = unknown>(
    selector: (state: TState) => Selected,
    equalityFn?: any,
  ): Selected;
  <TState = RootState, Selected = unknown>(
    selector: (state: TState) => Selected,
    options?: any,
  ): Selected;
}

export const useSelector: UseSelector = _useSelector;

export default getStore;
