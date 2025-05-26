import {createSelector} from 'reselect';

export const refillPRVSelector = state => state.refillPRV;

export const modalVisibleSelector = createSelector(
  refillPRVSelector,
  ({isVisible}) => isVisible,
);

export const minPRVNeededSelector = createSelector(
  refillPRVSelector,
  ({minPRVNeeded}) => minPRVNeeded,
);
