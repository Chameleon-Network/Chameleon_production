import {createSelector} from 'reselect';
import {RootState} from '../getStore';
export const tabsSelector = (state: RootState) => state.tabs;

export const activedTabSelector = createSelector(
  tabsSelector,
  tabs => (rootTabID: string) => tabs[rootTabID],
);
