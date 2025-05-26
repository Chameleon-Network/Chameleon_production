import React, {memo, useCallback, useEffect} from 'react';
import {AppState, AppStateStatus, Linking, StyleSheet} from 'react-native';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import ErrorBoundary from 'react-native-error-boundary';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LoadingContainer} from './components/core';
import {WithdrawHistory} from './models/dexHistory';
import {ROUTE_NAMES} from './router';
import {navigateToAddPin, navigationRef} from './router/NavigationServices';
import {SplashNavigator} from './router/navigators/SplashNavigator';
import QrCodeScannerScreen from './screens/QRCodeScannerScreen/QrCodeScannerScreen';
import RefillPRVModal from './screens/RefillPRV/RefillPRV.Modal';
import {
  getCurrentRouteName,
  setCurrentRouteName,
} from './services/RouteNameService';
import {useThemeName} from './store';
import {useSelector} from './store/getStore';
import {setWaitingPin} from './store/pin';
import {loadPin} from './store/pin/functions';
import {getSettings} from './store/settings/functions';
import {THEME} from './styles';
import {sleep} from './utils';
import AddPinScreen from './screens/AddPin';
import MasterKeysScreen from './screens/MasterKeys/MasterKeysScreen';
import InitMasterKeyScreen from './screens/InitMasterKey';
import InitMasterKeyPhraseScreen from './screens/InitMasterKeyPhrase';
import InitVerifyPassphraseScreen from './screens/InitVerifyPassphrase';
import InitImportMasterKeyScreen from './screens/InitImportMasterKey';
import KeysExplainedScreen from './screens/KeysExplained/KeyExplainedScreen';
import MarketScreen from './screens/Market/MarketScreen';
import {TabBarNavigator} from './router/navigators/TabBarNavigator';
import {MoreScreen} from './screens/More';
import ShieldScreen from './screens/Shield/ShieldScreen';
import WhyShieldScreen from './screens/WhyShield/WhyShieldScreen';
import {ErrorBoundaryScreen} from './components/ErrorBoundary/ErrorBoundary';
import SelectAccountScreen from './screens/SelectAccount/SelectAccountScreen';
import KeychainHome from './screens/Setting/Keychain/Keychain.home';
import MarketSearchCoinsScreen from './screens/MarketSearchCoins/MarketSearchCoinsScreen';
import NewsScreen from './screens/News/NewsScreen';
import {CoinInfoScreen} from './screens/Wallet/CoinInfo';
import Community from './screens/Community';
import SplashScreen from 'react-native-splash-screen';
import StandByScreen from './screens/StandBy/StandByScreen';
import OrderLimitScreen from './screens/OrderLimit/OrderLimitScreen';
import {NFTTokenScreen} from './screens/NFTToken';
import {WalletDetailScreen} from './screens/Wallet/Detail';
import {TxHistoryDetail} from './screens/Wallet/History';
import ShieldRefund from './screens/Shield/ShieldRefund';
import FollowToken from './screens/FollowToken';
import {ShieldGenQRCode} from './screens/Shield/GenQRCode';
import {
  Contribute,
  ContributeConfirm,
  CreatePool,
  CreatePoolConfirm,
  RemovePool,
  RemovePoolConfirm,
} from './screens/Liquidity';
import {OrderLimitDetail} from './screens/OrderLimit';
import Receipt from './screens/Receipt';
import FrequentReceivers, {
  FrequentReceiversForm,
  SelectNetworkName,
} from './screens/FrequentReceivers';
import {
  ContributeHistoryDetail,
  LiquidityHistories,
  RemoveLPDetail,
  WithdrawFeeLPDetail,
} from './screens/LiquidityHistories';
import SelectTokenScreen from './screens/Swap/SelectToken/SelectTokenScreen';
import SelectTokenModal from './screens/SelectToken/SelectTokenModal';
import { SelectTokenTrade } from './screens/SelectToken';
// import WebViewScreen from './screens/WebView/WebViewScreen';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator
      initialRouteName={ROUTE_NAMES.MainTabBar}
      screenOptions={{
        headerShown: false,
      }}>
      {/* HomeRoutes */}
      <MainStack.Screen
        name={ROUTE_NAMES.MainTabBar}
        component={TabBarNavigator}
      />
      <MainStack.Screen name={ROUTE_NAMES.More} component={MoreScreen} />
      <MainStack.Screen name={ROUTE_NAMES.Market} component={MarketScreen} />
      {/*masterKeyRoutes  */}
      <MainStack.Group>
        <MainStack.Screen name={ROUTE_NAMES.AddPin} component={AddPinScreen} />
        <MainStack.Screen
          name={ROUTE_NAMES.MasterKeys}
          component={MasterKeysScreen}
        />
        <MainStack.Screen
          name={ROUTE_NAMES.ImportMasterKey}
          component={InitImportMasterKeyScreen}
        />
        <MainStack.Screen
          name={ROUTE_NAMES.CreateMasterKey}
          component={InitMasterKeyScreen}
        />
        <MainStack.Screen
          name={ROUTE_NAMES.MasterKeyPhrase}
          component={InitMasterKeyPhraseScreen}
        />
        <MainStack.Screen
          name={ROUTE_NAMES.VerifyPassphrase}
          component={InitVerifyPassphraseScreen}
        />
        <MainStack.Screen
          name={ROUTE_NAMES.KeysExplained}
          component={KeysExplainedScreen}
        />
      </MainStack.Group>
      {/* end masterKeyRoutes */}

      <MainStack.Screen name={ROUTE_NAMES.Shield} component={ShieldScreen} />
      <MainStack.Screen
        name={ROUTE_NAMES.WhyShield}
        component={WhyShieldScreen}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.SelectAccount}
        component={SelectAccountScreen}
      />
      <MainStack.Screen name={ROUTE_NAMES.Keychain} component={KeychainHome} />
      <MainStack.Screen
        name={ROUTE_NAMES.MarketSearchCoins}
        component={MarketSearchCoinsScreen}
      />
      {/* <MainStack.Screen name={ROUTE_NAMES.News} component={NewsScreen} /> */}
      <MainStack.Screen
        name={ROUTE_NAMES.CoinInfo}
        component={CoinInfoScreen}
      />
      <MainStack.Screen name={ROUTE_NAMES.Community} component={Community} />
      <MainStack.Screen name={ROUTE_NAMES.Standby} component={StandByScreen} />
      <MainStack.Screen
        name={ROUTE_NAMES.OrderLimit}
        component={OrderLimitScreen}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.NFTToken}
        component={NFTTokenScreen}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.WalletDetail}
        component={WalletDetailScreen}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.TxHistoryDetail}
        component={TxHistoryDetail}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.ShieldRefund}
        component={ShieldRefund}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.FollowToken}
        component={FollowToken}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.ShieldGenQRCode}
        component={ShieldGenQRCode}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.ContributePool}
        component={Contribute}
      />
      <MainStack.Screen name={ROUTE_NAMES.CreatePool} component={CreatePool} />
      <MainStack.Screen name={ROUTE_NAMES.RemovePool} component={RemovePool} />
      <MainStack.Screen
        name={ROUTE_NAMES.ContributeConfirm}
        component={ContributeConfirm}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.CreatePoolConfirm}
        component={CreatePoolConfirm}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.RemovePoolConfirm}
        component={RemovePoolConfirm}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.OrderLimitDetail}
        component={OrderLimitDetail}
      />
      <MainStack.Screen name={ROUTE_NAMES.Receipt} component={Receipt} />
      <MainStack.Screen
        name={ROUTE_NAMES.FrequentReceivers}
        component={FrequentReceivers}
      />

      <MainStack.Screen
        name={ROUTE_NAMES.FrequentReceiversForm}
        component={FrequentReceiversForm}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.SelectNetworkName}
        component={SelectNetworkName}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.LiquidityHistories}
        component={LiquidityHistories}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.ContributeHistoryDetail}
        component={ContributeHistoryDetail}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.RemoveLPDetail}
        component={RemoveLPDetail}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.WithdrawFeeLPDetail}
        component={WithdrawFeeLPDetail}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.SelectTokenScreen}
        component={SelectTokenScreen}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.SelectTokenModal}
        component={SelectTokenModal}
      />
      <MainStack.Screen
        name={ROUTE_NAMES.SelectTokenTrade}
        component={SelectTokenTrade}
      />
    </MainStack.Navigator>
  );
};

const MainTabBar = memo(() => {
  const pinState = useSelector(state => state?.pin);
  const {pin, authen, loading, waiting} = pinState;

  const [mounted, setMounted] = React.useState(false);

  const handleLoadPin = async () => await loadPin();

  const currentRouteName = getCurrentRouteName();

  useEffect(() => {
    if (pin && !authen && currentRouteName !== ROUTE_NAMES.Setting) {
      navigateToAddPin({action: 'login'});
    }
  }, [pin]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (mounted) {
        if (nextAppState === 'background') {
          if (pin && !WithdrawHistory.withdrawing) {
            navigateToAddPin({action: 'login'});
            setWaitingPin(false);
          }
          if (WithdrawHistory.withdrawing) {
            setWaitingPin(true);
          }
        }
      }
    },
    [pinState, mounted],
  );

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    setMounted(true);
    return () => {
      setMounted(false);
      appStateListener.remove();
    };
  }, [pinState]);

  useEffect(() => {
    SplashScreen.hide();
    handleLoadPin();
  }, []);

  if (loading) {
    return <LoadingContainer />;
  }

  return (
    <>
      <MainNavigator />
      <RefillPRVModal />
    </>
  );
});

const urlHandler = async ({url}: {url: string}) => {
  try {
    return;
  } catch (error) {
    console.log('error urlHandler ', error);
  }
  return;
};

const Routes = () => {
  const themeName = useThemeName();

  useEffect(() => {
    let a: any = undefined;
    let isMounted = true;

    const getUrlAsync = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url && isMounted) {
          sleep(0.5).then(() => urlHandler({url}));
        }
      } catch (error) {
        console.error(
          'An error occurred while getting the initial URL:',
          error,
        );
        setTimeout(() => {
          if (isMounted) {
            Linking.getInitialURL()
              .then(url => {
                if (url) {
                  sleep(0.5).then(() => urlHandler({url}));
                }
              })
              .catch(err =>
                console.error(
                  'An error occurred on retrying to get the initial URL:',
                  err,
                ),
              );
          }
        }, 2000); // Retry after 2 seconds
      }
    };

    getUrlAsync();

    setTimeout(() => {
      a = Linking.addEventListener('url', urlHandler);
    }, 2000);

    return () => {
      isMounted = false;
      a && a.remove();
    };
  }, []);

  const onStateChange = useCallback(() => {
    const previousRouteName = getCurrentRouteName();
    // @ts-ignore
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (currentRouteName && previousRouteName !== currentRouteName) {
      // analytics().setCurrentScreen(currentRouteName);
      setCurrentRouteName(currentRouteName);
    }
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={onStateChange}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: themeName === 'dark' ? '#242424' : '#fff',
        },
      }}>
      <RootStack.Navigator
        initialRouteName={'MainHome'}
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <RootStack.Screen name={'Splash'} component={SplashNavigator} />
        <RootStack.Screen name={'MainHome'} component={MainTabBar} />
        <RootStack.Screen
          name={'QRCodeScanner'}
          component={QrCodeScannerScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const _Route = () => {
  const CustomFallback = useCallback(
    (props: {error: Error; resetError: Function}) => {
      return <ErrorBoundaryScreen {...props} isTabBarMode={false} name={''} />;
    },
    [],
  );

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* <NotificationHandler />
        <AppBadgeComponent /> */}
        <Routes />
      </SafeAreaView>
    </ErrorBoundary>
  );
};
export default _Route;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.header.backgroundColor,
  },
});
