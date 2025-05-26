import {TouchableOpacity, View} from '@components/core';
import {View2} from '@components/core/View';
import Header from '@src/components/Header/Header';
import {MAIN_WEBSITE} from '@src/constants/config';
import {COLORS} from '@src/styles';
import LocalDatabase from '@src/utils/LocalDatabase';
import {isIOS} from '@utils/platform';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';
import styles from './style';
import {useNavigation} from '@react-navigation/native';

const Community = () => {
  const navigation = useNavigation();
  const isFocused = true; // TODO: Add isFocused
  const webViewRef = useRef();
  const [loading, setLoading] = useState(true);
  const [backable, setBackable] = useState(false);
  const [url, setUrl] = useState('');
  const [showBottomBar, setShowBottomBar] = useState(true);

  useEffect(() => {
    if (isFocused) {
      const {uri: _uri} = navigation?.state?.params || {};
      if (_uri) {
        webViewRef?.current?.injectJavaScript(`location.href = '${_uri}';`);
        navigation?.setParams({uri: null});
        return setUrl(_uri);
      }
      // Check if the cache is existing
      LocalDatabase.getUriWebviewCommunity()
        .then(val => {
          if (val) {
            var pattern = /^((http|https|ftp):\/\/)/;
            if (!pattern.test(url)) {
              setUrl(val);
            } else {
              setUrl(MAIN_WEBSITE);
            }
          } else {
            setUrl(MAIN_WEBSITE);
          }
        })
        .catch(err => {
          setUrl(MAIN_WEBSITE);
        });
    }
  }, []);

  const _keyboardDidShow = useCallback(() => {
    setShowBottomBar(false);
  }, []);

  const _keyboardDidHide = useCallback(() => {
    setShowBottomBar(true);
  }, []);

  useEffect(() => {
    if (isIOS()) return;
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      if (isIOS()) return;
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const goBack = () => {
    if (!backable) {
      setUrl(MAIN_WEBSITE);
      webViewRef?.current?.reload();
    } else {
      webViewRef?.current?.goBack();
    }
  };
  const goForward = () => {
    webViewRef.current.goForward();
  };

  const stateHandler = state => {
    if (state?.url?.includes('about:blank')) {
      setBackable(state?.canGoBack);
      setUrl(MAIN_WEBSITE);
    } else {
      setBackable(state?.canGoBack);
      // No need to clarify here
      // setUrl(MAIN_WEBSITE);
      // setUrl(`${state?.url}`);
    }
  };

  const goHome = async () => {
    setUrl(MAIN_WEBSITE);
    await LocalDatabase.setUriWebviewCommunity(MAIN_WEBSITE);
    setTimeout(() => {
      webViewRef?.current?.reload();
    }, 750);
  };

  const reload = () => {
    try {
      webViewRef?.current?.reload();
    } catch (err) {
      console.log(err?.message || '');
    }
  };

  const renderBottomBar = () => {
    return (
      <View style={styles.navigation}>
        <TouchableOpacity onPress={() => goBack()} style={styles.back}>
          <Ionicons
            name="ios-arrow-back"
            size={30}
            color={COLORS.colorGreyBold}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goForward()} style={styles.back}>
          <Ionicons
            name="ios-arrow-forward"
            size={30}
            color={COLORS.colorGreyBold}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.back}>
          {/* <SimpleLineIcons name="home" size={25} color={COLORS.colorGreyBold} /> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => reload()} style={styles.back}>
          <Ionicons name="ios-refresh" size={30} color={COLORS.colorGreyBold} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View2 style={styles.container}>
      <Header title="Community" style={{paddingLeft: 20}} />
      <View fullFlex borderTop style={{overflow: 'hidden'}}>
        <WebView
          key={`${url}`}
          startInLoadingState
          onLoadEnd={data => {
            setLoading(false);
          }}
          onShouldStartLoadWithRequest={event => {
            if (event.url.startsWith('http')) {
              return true;
            }
            return false;
          }}
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1"
          source={{uri: url}}
          ref={webViewRef}
          useWebKit
          onNavigationStateChange={stateHandler}
          injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }
      
          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          });
        })();
      
        true;
      `}
          onMessage={async ({nativeEvent: state}) => {
            if (state.data === 'navigationStateChange') {
              if (
                typeof state?.url === 'string' &&
                state.url.includes(MAIN_WEBSITE)
              ) {
                await LocalDatabase.setUriWebviewCommunity(state?.url);
              }
            }
          }}
        />
      </View>
      {showBottomBar && renderBottomBar()}
    </View2>
  );
};

export default memo(Community);
