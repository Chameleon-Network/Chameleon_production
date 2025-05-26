import React, { useEffect } from 'react';
import { LogBox, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// import {MAIN_WEBSITE} from './constants/config';
import { configureStore } from './store/configureStore';
import { setStore } from './store/getStore';
import { reducers } from './store/reducer';
import { fontNames } from './styles/font';
import { ThemeProvider } from './theme/theme';
import { setCustomText } from './utils';
// import LocalDatabase from './utils/LocalDatabase';
import Orientation from 'react-native-orientation-locker';
import { RootSiblingParent } from 'react-native-root-siblings';
import { isTablet } from './hooks';
import Routes from './Routes';
import NetworkStatus from './services/NetworkStatus';
import { initCoreStore } from './store';

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['', 'ViewPropTypes']);
LogBox.ignoreLogs(['', 'new NativeEventEmitter']);
LogBox.ignoreLogs([
  'ViewPropTypes',
  '[react-native-gesture-handler]',
  'Warning',
]);
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const { store } = initCoreStore(
  {
    ...reducers,
  },
  [
    'listPools',
    'decimalDigits',
    'isToggleUSD',
    'toggleBackupAllKeys',
    'usePRVToPayFee',
    'marketTab',
    'showWalletBalance',
    'showWizard',
    'followDefaultPTokens',
    'isFollowedDefaultPTokens',
    'detectNetworkName',
    'videos',
    'codepushVersion',
    'newUserTutorial',
    'storage',
    'defaultConfigs'
  ],
);
// gets the current screen from navigation state
function getActiveRouteName(navigationState: any) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

setCustomText({
  style: {
    fontFamily: fontNames.regular,
  },
});

interface IProps {
  setCurrentScreen: () => void;
}

const App = (props: IProps) => {
  useEffect(() => {
    setStore(store);

    if (!isTablet()) {
      Orientation.lockToPortrait();
    }

    // Init recursive main website
    resetMainCommunity();
    // Notification
  }, []);

  const resetMainCommunity = async () => {
    // Init default website in community
    // await LocalDatabase.setUriWebviewCommunity(MAIN_WEBSITE);
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <RootSiblingParent>
            <ThemeProvider>
              <NetworkStatus />
              <RootSiblingParent>
                <Routes />
              </RootSiblingParent>
            </ThemeProvider>
          </RootSiblingParent>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
