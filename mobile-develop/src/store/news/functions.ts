import { http } from '@src/services';
import {
  checkUnreadNews,
  fetchedNews,
  fetchFailNews,
  fetchingNews
} from '.';
import getStore from '../getStore';
import { newsSelector } from './selectors';

export const apiGetNews = (params?: any) => {
  return new Promise((resolve, reject) => {
    return http
      .get('news/list', {
        params,
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const apiReadNews = ({id}) =>
  new Promise((resolve, reject) =>
    http
      .post(`news/read/${id}`)
      .then(rs => resolve(rs))
      .catch(e => reject(e)),
  );

export const apiRemoveNews = ({id}) =>
  new Promise((resolve, reject) =>
    http
      .post(`news/remove/${id}`)
      .then(rs => resolve(rs))
      .catch(e => reject(e)),
  );

export const apiCheckUnreadNews = () => {
  return new Promise((resolve, reject) => {
    return http
      .get('news/check-unread')
      .then(rs => resolve(rs))
      .catch(e => reject(false));
  });
};

export const apiMarkReadAllNews = () => {
  return new Promise((resolve, reject) => {
    return http
      .post('news/check-unread')
      .then(rs => resolve(rs))
      .catch(e => reject(false));
  });
};

export const actionFetchingNews = () => fetchingNews();

export const actionFetchedNews = (payload: any) => fetchedNews(payload);

export const actionFetchFailNews = () => fetchFailNews();

export const actionFetchNews = async () => {
  const state = getStore().getState();
  try {
    const {isFetching} = newsSelector(state);
    if (isFetching) {
      return;
    }
    await actionFetchingNews();
    const data = await apiGetNews();
    await actionCheckUnreadNews();
    await actionFetchedNews({data});
  } catch (error) {
    await actionFetchFailNews();
    throw new Error(error);
  }
};

export const actionReadNews = async (id: string) => {
  try {
    await apiReadNews({id});
  } catch (error) {
    console.log(error);
  } finally {
    // dispatch(actionFetchNews()); // Now no need anymore.
  }
};

export const actionRemoveNews = async (id: string) => {
  try {
    await apiRemoveNews({id});
  } catch (error) {
    console.log(error);
  } finally {
    await actionFetchNews();
  }
};

export const actionCheckUnreadNews = async () => {
  try {
    const unread = await apiCheckUnreadNews();
    checkUnreadNews(unread);
  } catch (error) {
    console.debug(error);
  }
};
