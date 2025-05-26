import {createSelector} from 'reselect';
import { RootState } from '../getStore';

export const unShieldSelector = (state: RootState) => state.unShield;

export const unShieldStorageDataSelector = createSelector(
  unShieldSelector,
  unShield => unShield?.storage,
);
