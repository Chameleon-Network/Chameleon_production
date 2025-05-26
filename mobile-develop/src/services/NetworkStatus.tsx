import React, {memo, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {sleep} from '@src/utils';
import {useIsAppActive} from '@src/hooks';
import {setNetworkConnected} from '@src/store/global/hooks';

const NetworkStatus = memo(() => {
  const appActive = useIsAppActive();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      //your code here
      const offline = !(state.isConnected && state.isInternetReachable);
      setNetworkConnected(!offline);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (appActive) {
      sleep(0.3).then(() => {
        NetInfo.fetch().then(state => {
          const offline = !(state.isConnected && state.isInternetReachable);
          setNetworkConnected(!offline);
        });
      });
    }
  }, [appActive]);

  return null;
});

export default NetworkStatus;
