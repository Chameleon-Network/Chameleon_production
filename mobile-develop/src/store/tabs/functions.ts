import { changeTab } from './index';

export const actionChangeTab = (payload: { rootTabID: string, tabID: string }) => {
  return changeTab(payload);
};
