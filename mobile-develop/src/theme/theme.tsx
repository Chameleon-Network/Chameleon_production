import {StorageMMKV} from '@src/services';
import {globalStore, useThemeName} from '@src/store';
import {ThemeNameEnum} from '@src/types';
import React, {useEffect, useMemo} from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider as StyledComponentsThemeProvider} from 'styled-components/native';
import {useDarkTheme, useLightTheme} from './hooks';

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  useEffect(() => {
    const themeName = StorageMMKV.getItem('themeName');
    themeName && globalStore.setThemeAction(themeName as ThemeNameEnum);
  }, []);

  const currentThemeName = useThemeName();
  const defaultLightTheme = useLightTheme();
  const defaultDarkTheme = useDarkTheme();

  const currentThemeValue = useMemo(() => {
    return currentThemeName === ThemeNameEnum.WHITE
      ? {
          ...defaultLightTheme,
        }
      : {
          ...defaultDarkTheme,
        };
  }, [defaultLightTheme, defaultDarkTheme, currentThemeName]);

  return (
    <StyledComponentsThemeProvider theme={currentThemeValue}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={
          currentThemeName === ThemeNameEnum.DARK
            ? 'light-content'
            : 'dark-content'
        }
      />
      <>{children}</>
    </StyledComponentsThemeProvider>
  );
};
