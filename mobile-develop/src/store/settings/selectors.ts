import { createSelector } from "reselect";
import { RootState } from "../getStore";

const settingsSelector = (state: RootState) => state.settings;

export const settings = (state: RootState) => state?.settings?.data;

export const videosSelector = createSelector(
  settingsSelector,
  ({videos}) => videos,
);

export const codepushVersionSelector = createSelector(
  settingsSelector,
  ({codepushVer}) => codepushVer,
);

export const newUserTutorialSelector = createSelector(
  settingsSelector,
  ({newUserTutorial}) => newUserTutorial,
);
