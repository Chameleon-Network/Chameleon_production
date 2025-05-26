import React, {memo, useCallback, useEffect, useMemo} from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {CustomTabBar} from '../components/CustomTabBar';
import {
  AssetsIcon,
  LiquidityIcon,
  MarketIcon,
  MoreIcon,
  PrivacyAppsIcon,
  TradeIcon,
} from '@src/components/Icons';
import {useDictionary} from '@src/dictionary/hooks';
import MarketScreen from '@src/screens/Market/MarketScreen';
import EarnScreen from '@src/screens/Earn/EarnScreen';
import TradeScreen from '@src/screens/Trade/TradeScreen';
import AssetsScreen from '@src/screens/Assets/AssetsScreen';
import PrivacyAppsScreen from '@src/screens/PrivacyApps/PrivacyAppsScreen';
import MoreScreen from '@src/screens/More/MoreScreen';
import SplashScreen from 'react-native-splash-screen';

const TabBarStack = createBottomTabNavigator();

export const TabBarNavigator = memo(() => {
  const dict = useDictionary();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }),
    [],
  );

  const renderCustomTabBar = useCallback((props: BottomTabBarProps) => {
    return <CustomTabBar {...props} />;
  }, []);

  const options = useMemo(() => {
    return {
      Market: {
        title: dict.Markets,
        tabBarIcon: ({focused}: {focused: boolean}) => (
          <MarketIcon active={focused} />
        ),
      },
      HomeLP: {
        title: dict.Earn,
        tabBarIcon: ({focused}: {focused: boolean}) => (
          <LiquidityIcon active={focused} />
        ),
      },
      TabTrade: {
        title: dict.Trade,
        tabBarIcon: ({focused}: {focused: boolean}) => (
          <TradeIcon active={focused} />
        ),
      },
      Assets: {
        title: dict.Wallet,
        tabBarIcon: ({focused}: {focused: boolean}) => (
          <AssetsIcon active={focused} />
        ),
      },
      PrivacyApps: {
        title: dict.Apps,
        tabBarIcon: ({focused}: {focused: boolean}) => (
          <PrivacyAppsIcon active={focused} />
        ),
      },
      More: {
        title: dict.More,
        tabBarIcon: ({focused}: {focused: boolean}) => (
          <MoreIcon active={focused} />
        ),
      },
    };
  }, [dict]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <TabBarStack.Navigator
      initialRouteName={'MarketScreen'}
      screenOptions={screenOptions}
      tabBar={renderCustomTabBar}>
      <TabBarStack.Screen
        name={'MarketScreen'}
        options={options.Market}
        component={MarketScreen}
      />
      <TabBarStack.Screen
        name={'EarnScreen'}
        options={options.HomeLP}
        component={EarnScreen}
      />
      <TabBarStack.Screen
        name={'TradeScreen'}
        options={options.TabTrade}
        component={TradeScreen}
      />
      <TabBarStack.Screen
        name={'AssetsScreen'}
        options={options.Assets}
        component={AssetsScreen}
      />
      <TabBarStack.Screen
        name={'PrivacyAppsScreen'}
        options={options.PrivacyApps}
        component={PrivacyAppsScreen}
      />
      <TabBarStack.Screen
        name={'MoreScreen'}
        options={options.More}
        component={MoreScreen}
      />
    </TabBarStack.Navigator>
  );
});
