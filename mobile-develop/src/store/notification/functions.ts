import {http} from '@src/services';
import {checkUnreadNews, syncNews} from '.';

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

export const requestFetchNews = async (params?: any) => {
  const news = await apiGetNews(params);
  syncNews(news);
  return news;
};

export const requestReadNews = async (id: string) => {
  const news = await apiReadNews({id});
  return news;
};

export const requestRemoveNews = async (id: string) => {
  const news = await apiRemoveNews({id});

  //TODO: Fetch news again if remove news success
  await requestFetchNews();
  return news;
};

export const requestCheckUnreadNews = async () => {
  const unread = await apiCheckUnreadNews();

  if (unread) {
    checkUnreadNews(unread);
  }
  return unread;
};
