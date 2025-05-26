import React, {memo} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {MainNavigator} from './MainNavigator';
const MainAndModalStack = createStackNavigator();

export const ModalNavigator = memo(() => {
  return (
    <MainAndModalStack.Navigator
      initialRouteName={'Main'}
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
      }}>
      <MainAndModalStack.Screen name={'Main'} component={MainNavigator} />
    </MainAndModalStack.Navigator>
  );
});
