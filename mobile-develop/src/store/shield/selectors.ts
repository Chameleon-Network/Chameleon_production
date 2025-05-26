import { createSelector } from 'reselect';
import { RootState } from '../getStore';

export const shieldSelector = (state: RootState) => state.shield;

export const shieldDataSelector = createSelector(
  shieldSelector,
  shield => shield?.data,
);

export const shieldStorageSelector = createSelector(
  shieldSelector,
  shield => shield?.storage,
);
