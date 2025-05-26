import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from '@src/components/core';
import { useNavigationParams } from '@src/hooks';
import { goBack } from '@src/router/NavigationServices';
import { useSelector } from '@src/store/getStore';
import { loadAllMasterKeys } from '@src/store/masterKey/functions';
import { updatePin } from '@src/store/pin/functions';
import { convertUtils } from '@src/utils/convert';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, AppState, AppStateStatus, BackHandler, Easing, Image, NativeEventSubscription } from 'react-native';
import { Icon } from 'react-native-elements';
import RNRestart from 'react-native-restart';
import styles from './styles';

// Add FaceID icon import
const icFaceId = require('../../assets/images/icons/ic_faceid.png');

export const TAG = 'AddPIN';

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const pinLength = [1, 2, 3, 4, 5, 6];
const opacity = 0.1;

const initialState = {
  pin1: '',
  pin2: '',
  nextPin: false,
  bioSupportedType: null,
  action: null,
  appState: '',
};

interface PinState {
  pin1: string;
  pin2: string;
  nextPin: boolean;
  bioSupportedType: 'FaceID' | 'TouchID' | null;
  action?: string | null;
  appState: string;
}

interface AddPinProps {
  pin: string;
  navigation: any;
  updatePin: (pin: string) => void;
  actionAuthen: () => Promise<void>;
  loadAllMasterKeys: (options: any) => Promise<void>;
  currentScreen: string;
  prevScreen: string;
  action?: string;
  redirectRoute?: string;
}

const AddPinScreen = () => {
  const {pin, waiting} = useSelector(state => state.pin);
  const { action, redirectRoute } = useNavigationParams<AddPinProps>();
  const navigation = useNavigation();
  const [state, setState] = useState<PinState>({ ...initialState, action });
  const animatedValue = useRef(new Animated.Value(0)).current;
  const backHandler = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    backHandler.current = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    const checkBiometrics = async () => {
      await checkTouchSupported();
    };
    checkBiometrics();
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      backHandler.current?.remove();
      setState({ ...initialState });
      appStateListener.remove();
    };
  }, []);

  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    const { appState } = state;
    if (
      appState.match(/inactive|background|active/) &&
      nextAppState === 'active'
    ) {
      setState(prev => ({ ...prev, pin1: '', pin2: '' }));
    }
    if (appState === '' && nextAppState === 'active') {
      handleBioAuth();
    }
    setState(prev => ({ ...prev, appState: nextAppState }));
  },[state]);

  const handleAnimation = () => {
    Animated.sequence([
      // start rotation in one direction (only half the time is needed)
      Animated.timing(animatedValue, {
        toValue: 1.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -1.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0.0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkTouchSupported = useCallback(async () => {
    const { action } = state;
    if (action === 'login' || action === 'remove') {
      try {
        // Check if hardware is available
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
          return;
        }

        // Get authentication types
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        let bioType: 'FaceID' | 'TouchID' | null = null;
        
        // Determine if it's FaceID or TouchID/Fingerprint
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          bioType = 'FaceID';
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          bioType = 'TouchID';
        }
        
        if (bioType) {
          setState(prev => ({ ...prev, bioSupportedType: bioType }));
          handleBioAuth();
        }
      } catch (error) {
        console.log('Error checking biometric support:', error);
      }
    }
  }, [state]);

  const handleBackPress = () => {
    return true;
  };

  const isCorrectPin = useCallback((pin2: string) => {
    if (convertUtils.toHash(pin2) !== pin) {
      handleAnimation();
      return false;
    }
    return true;
  }, [convertUtils, pin]);

  const handleUpdatePin = useCallback((newPin: string) => {
    updatePin(newPin);
    goBack();
  }, []);

  const handleInput = useCallback((key: string) => {
    const { pin1, action, nextPin, pin2 } = state;
    const currentPin = (nextPin ? pin2 : pin1) + key;

    if (nextPin) {
      setState(prev => ({ ...prev, pin2: currentPin }));
    } else {
      setState(prev => ({ ...prev, pin1: currentPin }));
    }

    if (currentPin.length === pinLength.length) {
      if (nextPin && pin1 !== currentPin) {
        // Toast.showError(MESSAGES.INCORRECT_PIN);
        handleAnimation();
      } else if (!pin) {
        if (!pin2) {
          return setState(prev => ({ ...prev, nextPin: true }));
        } else {
          handleUpdatePin(currentPin);
        }
      } else if (nextPin) {
        handleUpdatePin(currentPin);
      } else if (isCorrectPin(currentPin)) {
        if (action === 'remove') {
          removeSuccess();
        } else if (action === 'login') {
          loginSuccess();
        }
      }

      if (nextPin) {
        setState(prev => ({ ...prev, pin2: '' }));
      } else {
        setState(prev => ({ ...prev, pin1: '' }));
      }
    }
  }, [state]);

  const clearInput = useCallback(() => {
    const { pin1, nextPin, pin2 } = state;
    if (nextPin) {
      setState(prev => ({ ...prev, pin2: pin2.slice(0, Math.max(pin2.length - 1, 0)) }));
    } else {
      setState(prev => ({ ...prev, pin1: pin1.slice(0, Math.max(pin1.length - 1, 0)) }));
    }
  }, [state]);

  const loginSuccess = useCallback(async () => {
    // TODO: actionAuthen
    // await actionAuthen();
    if (redirectRoute) {
      navigation.navigate(redirectRoute as any, {});
    } else {
      goBack();
    }
  }, [redirectRoute]);

  const removeSuccess = useCallback(async () => {
    await loadAllMasterKeys({ migratePassCodeToDefault: true });
    handleUpdatePin('');
    setTimeout(() => {
      RNRestart.Restart();
    }, 500);
  }, [handleUpdatePin]);

  const handleBioAuth = useCallback(async () => {
    try {
      // Check if hardware is available
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        console.log('Biometric authentication not available on this device');
        return;
      }

      // Check if biometrics are enrolled
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        console.log('No biometrics enrolled on this device');
        return;
      }

      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock with biometrics',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const { action } = state;
        if (action === 'login') {
          loginSuccess();
        } else if (action === 'remove') {
          removeSuccess();
        }
      } else {
        console.log('Biometric authentication failed:', result.error);
      }
    } catch (error) {
      console.log('Biometric authentication error:', error);
    }
  }, [state]);

  const renderTitle = () => {
    const { nextPin } = state;

    if (!pin) {
      if (nextPin) {
        return <Text style={styles.title}>Please re-enter your passcode</Text>;
      }
      return <Text style={styles.title}>Enter a new passcode</Text>;
    }

    if (pin) {
      return <Text style={styles.title}>Enter your passcode</Text>;
    }
    return null;
  };

  const userPin = useMemo(() => {
    const { pin1, nextPin, pin2 } = state;
    return nextPin ? pin2 : pin1;
  }, [state?.nextPin, state?.pin2, state?.pin1]);

  return (
    <View style={styles.container} borderTop>
      {(action === 'login' || action === 'remove') && state?.bioSupportedType && (
        <TouchableOpacity
          style={styles.fingerprint}
          onPress={handleBioAuth}
          activeOpacity={opacity}
        >
          {state?.bioSupportedType === 'FaceID' ? (
            <Image
              source={icFaceId}
              style={[
                styles.icon,
                { height: 45, width: 45, resizeMode: 'contain' },
              ]}
            />
          ) : (
            <Icon
              containerStyle={styles.icon}
              type="material"
              name="fingerprint"
              size={50}
            />
          )}
        </TouchableOpacity>
      )}
      {renderTitle()}
      <View style={styles.input}>
        {pinLength.map((item) => (
          <View
            key={item}
            style={[styles.dot, userPin.length >= item && styles.active]}
          />
        ))}
      </View>
      <Animated.View
        style={{
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [-1, 1],
                outputRange: [-10, 10],
              }),
            },
          ],
        }}
      >
        <View style={styles.keyboard}>
          {keys.map((key) => (
            <TouchableOpacity
              key={key}
              id={key}
              style={styles.key}
              onPress={() => handleInput(key)}
              activeOpacity={opacity}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
          {action !== 'login' && (
            <TouchableOpacity
              style={[styles.key]}
              onPress={() => navigation.goBack()}
              activeOpacity={opacity}
            >
              <Icon
                containerStyle={styles.icon}
                color="white"
                type="material"
                name="chevron-left"
                size={35}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.key, styles.lastKey]}
            onPress={() => handleInput('0')}
            activeOpacity={opacity}
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.key]}
            onPress={() => clearInput()}
            activeOpacity={opacity}
          >
            <Icon
              containerStyle={styles.icon}
              color="white"
              type="material"
              name="backspace"
              size={20}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default AddPinScreen;