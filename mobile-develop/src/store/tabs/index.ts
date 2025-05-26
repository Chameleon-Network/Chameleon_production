import { createSlice } from '@reduxjs/toolkit';


const initialState = {};

export const tabsSlice = createSlice({
  name: 'tabs', // This is the name of the slice, we will later use this name to access the slice from the store
  initialState: initialState, // This is the initial state of the slice
  reducers: {
    changeTab: (state, action) => {
      const { rootTabID, tabID } = action.payload;
      return {
        ...state,
        [rootTabID]: tabID,
      };
    },
  },
});

export const changeTab = ({ rootTabID, tabID }: { rootTabID: string, tabID: string }) => {
  return tabsSlice.actions.changeTab({ rootTabID, tabID });
};
