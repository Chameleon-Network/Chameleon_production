import {createSelector} from 'reselect';
import {ThemeNameEnum} from '@src/types';
import {useDarkTheme, useLightTheme} from './hooks';
import {appTheme} from './theme.colors';

export const themeSelector = createSelector(
  state => state.theme,
  theme => theme,
);

export const themeNameSelector = createSelector(
  themeSelector,
  (theme: any) => theme.themeName as ThemeNameEnum,
);

export const getThemeByName = (themeName: ThemeNameEnum) => {
  return themeName === ThemeNameEnum.dark ? useDarkTheme() : useLightTheme();
};

export const themeModeSelector = createSelector(
  themeSelector,
  theme => theme.themeMode,
);

// export const colorsSelector = createSelector(themeModeSelector, themeMode =>
//   appTheme(themeMode),
// );

// export const colorsSelector = createSelector(themeModeSelector, (darkMode) => appTheme(darkMode));
