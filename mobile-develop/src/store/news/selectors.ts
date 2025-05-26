import {createSelector} from 'reselect';

export const newsSelector = state => state.news;

export const newsDataSelector = createSelector(
  newsSelector,
  news => news?.data || [],
);
