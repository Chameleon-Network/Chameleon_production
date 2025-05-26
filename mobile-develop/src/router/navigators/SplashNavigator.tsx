import React, {memo} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {ROUTE_NAMES} from '../routeNames';

import GetStarted from '@src/screens/GetStarted';
import InitImportMasterKey from '@src/screens/InitImportMasterKey';
import InitMasterKey from '@src/screens/InitMasterKey';
import InitMasterKeyPhrase from '@src/screens/InitMasterKeyPhrase';
import InitVerifyPassphrase from '@src/screens/InitVerifyPassphrase';
import Tutorial from '@src/screens/Tutorial';
import AddPinScreen from '@src/screens/AddPin';

const SplashStack = createStackNavigator();

export const SplashNavigator = memo(() => {
  return (
    <SplashStack.Navigator
      initialRouteName={ROUTE_NAMES.GetStarted}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <SplashStack.Screen
        name={ROUTE_NAMES.GetStarted}
        component={GetStarted}
      />
      <SplashStack.Screen
        name={ROUTE_NAMES.InitMasterKey}
        component={InitMasterKey}
      />
      <SplashStack.Screen
        name={ROUTE_NAMES.InitMasterKeyPhrase}
        component={InitMasterKeyPhrase}
      />
      <SplashStack.Screen
        name={ROUTE_NAMES.InitVerifyPassphrase}
        component={InitVerifyPassphrase}
      />
      <SplashStack.Screen
        name={ROUTE_NAMES.InitImportMasterKey}
        component={InitImportMasterKey}
      />
      <SplashStack.Screen name={ROUTE_NAMES.AddPin} component={AddPinScreen} />
      <SplashStack.Screen name={ROUTE_NAMES.Tutorial} component={Tutorial} />
    </SplashStack.Navigator>
  );
});
