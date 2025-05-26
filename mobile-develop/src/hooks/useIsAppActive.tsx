import {useAppState} from '@react-native-community/hooks';
import {useMemo} from 'react';

export const useIsAppActive = () => {
  const appState = useAppState();
  return useMemo(() => appState === 'active', [appState]);
};
