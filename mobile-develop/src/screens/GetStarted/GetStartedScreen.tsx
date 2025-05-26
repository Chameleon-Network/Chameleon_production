import React, {memo, useCallback, useEffect, useState} from 'react';

import NetInfo from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/native';
import KeepAwake from '@sayem314/react-native-keep-awake';
import ButtonBasic from '@src/components/Button/ButtonBasic';
import {LoadingContainer, Text, Text3, View, View2} from '@src/components/core';
import {navigateToMainTabBar} from '@src/router/NavigationServices';
import {login} from '@src/services/auth';
import {ExHandler} from '@src/services/exception';
import {setTokenHeader} from '@src/services/http';
import Server from '@src/services/wallet/Server';
import {wizardSelector} from '@src/store/getStarted/selectors';
import {useSelector} from '@src/store/getStore';
import {requestFetchHome} from '@src/store/home/functions';
import {
  actionLoadInitial,
  loadAllMasterKeyAccounts,
  requestLoadDefaultWallet,
} from '@src/store/masterKey/functions';
import {requestCheckUnreadNews} from '@src/store/news/functions';
import {requestFetchPairs} from '@src/store/pairlist/functions';
import {requestFetchProfile} from '@src/store/profile/functions';
import {FONTS} from '@src/styles';
import {StyleSheet} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {batch} from 'react-redux';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import Wizard from '../Wizard';
import style from './style';

import {initialMasterKeySelector} from '@src/store/masterKey/selectors';
import {getVideoTutorial} from '@src/store/settings/functions';
import {newUserTutorialSelector} from '@src/store/settings/selectors';
import styled from 'styled-components/native';
import TutorialScreen from '../Tutorial';
import Welcome from './Welcome';
import {requestFetchListPools} from '@src/store/pdexV3/pools/functions';

const GetStartedScreen = memo(props => {
  const {loading, masterKeyList} = useSelector(initialMasterKeySelector);
  const newUser = useSelector(newUserTutorialSelector);

  const [errorMsg, setError] = useState('');
  const {isFetching} = useSelector(wizardSelector);
  const [checking, setChecking] = useState(false);
  const [connected, setConnected] = useState(false);

  const checkStatusNetwork = useCallback(async () => {
    try {
      setChecking(true);
      const {isConnected} = await NetInfo.fetch();
      await setConnected(!!isConnected);
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      setChecking(false);
    }
  }, []);

  const [{loading: loadingFetchData, error: errorFetchData}, fetchData] =
    useAsyncFn(async () => {
      await actionLoadInitial();
    }, []);

  const [
    {loading: loadingFetchTutorial, error: errorFetchTutorial},
    fetchTutorial,
  ] = useAsyncFn(async () => {
    await getVideoTutorial();
  }, []);

  const getErrorMsg = useCallback((error: any) => {
    const errorMessage = new ExHandler(
      error,
      "Something's not quite right. Please make sure you're connected to the internet.\n" +
        '\n' +
        "If your connection is strong but the app still won't load, please contact us at go@incognito.org.\n",
    )?.writeLog()?.message;
    return errorMessage;
  }, []);

  const fetchHomeConfigs = useCallback(async () => {
    try {
      await requestFetchHome();
      await requestCheckUnreadNews();
    } catch (error) {
      console.log('Fetching configuration for home failed.', error);
    }
  }, []);

  const configsApp = async () => {
    console.time('CONFIGS_APP');
    let hasError;
    let token;
    try {
      try {
        if (typeof global.login === 'function') {
          token = await global.login();
          setTokenHeader(token);
        }
      } catch (error) {
        console.log('CANT LOAD NEW ACCESS TOKEN');
        hasError = true;
      } finally {
        if (!token || hasError) {
          setError(
            'Hey, you there? Your internet connection is unstable. Please check your network settings and launch the app again.',
          );
        }
      }

      //TODO:
      login();
      batch(async () => {
        await requestFetchProfile();

        //TODO: Analytics here, do later
        // dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.OPEN_APP));
        requestFetchListPools();
        requestFetchPairs();
      });
      const servers = await Server.get();
      if (!servers || servers?.length === 0) {
        await Server.setDefaultList();
      }
      await requestLoadDefaultWallet();
      await loadAllMasterKeyAccounts();
    } catch (error) {
      hasError = !!error;
      await setError(getErrorMsg(error) || '');
      throw error;
    }
    console.timeEnd('CONFIGS_APP');
    if (!hasError) {
      setTimeout(() => {
        navigateToMainTabBar();
      }, 2000);
    }
  };

  const [
    {loading: loadingFetchConfigs, error: errorFetchConfigs},
    fetchConfigs,
  ] = useAsyncFn(async () => {
    await fetchHomeConfigs();
  }, []);

  const onRetry = async () => {
    try {
      await configsApp();
    } catch {
      //
    }
  };

  useEffect(() => {
    fetchTutorial();
    fetchData();
  }, []);

  useEffect(() => {
    checkStatusNetwork();
    onRetry();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHomeConfigs();
    }, []),
  );

  useEffect(() => {
    fetchConfigs();
    SplashScreen.hide();
  }, []);

  if (loadingFetchData || loadingFetchTutorial) {
    return <LoadingContainer />;
  }
  if (masterKeyList.length === 0 || !masterKeyList) {
    return <Welcome />;
  }

  if (newUser) {
    return <TutorialScreen />;
  }

  if (checking) {
    return <LoadingContainer size="large" />;
  }
  if (!connected) {
    return (
      <View style={styles.container} borderTop>
        <Text style={styles.text}>
          Your internet connection is currently unstable. Please check your
          network settings and try again!
        </Text>
        <ButtonBasic
          btnStyle={styles.btnStyle}
          title="Try again"
          onPress={checkStatusNetwork}
          titleStyle={styles.titleStyle}
        />
      </View>
    );
  }

  if (isFetching) {
    return <Wizard />;
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={{flex: 1}}>
        <KeepAwake />
        <View2 style={[style.container, {paddingHorizontal: 24}]}>
          <View2 style={style.getStartedBlock}>
            <Text style={[style.title, style.centerText]}>
              {'Entering incognito mode\nfor your crypto...'}
            </Text>
          </View2>
          {!!errorFetchConfigs && !loadingFetchConfigs && (
            <>
              <Text3 style={[style.errorMsg, style.centerText]}>
                {errorFetchConfigs.message}
              </Text3>
              <ButtonBasic
                btnStyle={style.retryBtn}
                title="Retry"
                onPress={onRetry}
              />
            </>
          )}
        </View2>
      </View>
    </SafeAreaView>
  );
});

export default GetStartedScreen;

const SafeAreaView = styled.SafeAreaView`
  background-color: ${({theme}) => theme.background2};
`;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 3,
  },
  btnStyle: {
    marginTop: 15,
    width: 100,
    height: 40,
  },
  titleStyle: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 3,
  },
});
