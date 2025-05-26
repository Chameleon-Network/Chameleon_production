import {createSlice} from '@reduxjs/toolkit';
import {StoreService} from '..';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: [],
  isReadAll: 0,
};

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    fetchingNews: state => {
      return {
        ...state,
        isFetching: true,
      };
    },
    fetchedNews: (state, action) => {
      const { data } = action.payload;
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        data: [...data],
      };
    },
    fetchFailNews: state => {
      return {
        ...state,
        isFetched: false,
        isFetching: false,
      }
    },
    checkUnreadNews: (state, action) => {
      return {
        ...state,
        isReadAll: action.payload,
      }
    },
  },
});

export const fetchingNews = () =>  {
  StoreService?.current?.dispatch(newsSlice.actions.fetchingNews());
};

export const fetchedNews = (data: []) => {
  StoreService?.current?.dispatch(newsSlice.actions.fetchedNews(data));
  return data;
};

export const fetchFailNews = () => {
  StoreService?.current?.dispatch(newsSlice.actions.fetchFailNews());
};

export const checkUnreadNews = (isReadAll: number) => {
  StoreService?.current?.dispatch(newsSlice.actions.checkUnreadNews(isReadAll));
  return isReadAll;
};
