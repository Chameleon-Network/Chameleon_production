import React, {useCallback, useMemo} from 'react';
import {CONSTANT_CONFIGS, MESSAGES as MESSAGES_GLOBAL} from '@src/constants';
import {Text} from '@components/core';
import {MESSAGES} from '@screens/Dex/constants';
import {navigateToWebview} from '@src/router/NavigationServices';
import {defaultAccount} from '@src/store/account/selectors';
import {COLORS, FONTS} from '@src/styles';
import {StyleSheet} from 'react-native';
import {useSelector} from '@src/store/getStore';

export const useError = (errorMessage: string) => {
  const account = useSelector(defaultAccount);
  const navigateFaucet = useCallback(
    () =>
      navigateToWebview({
        url: CONSTANT_CONFIGS.FAUCET_URL + `address=${account?.paymentAddress}`,
      }),
    [account?.paymentAddress],
  );

  return useMemo(() => {
    errorMessage = errorMessage || '';
    if (
      typeof errorMessage === 'string' &&
      errorMessage.includes('Faucet') &&
      errorMessage.includes(MESSAGES_GLOBAL.PRV_NOT_ENOUGHT)
    ) {
      return (
        <Text style={styles.error1}>
          {MESSAGES_GLOBAL.PRV_NOT_ENOUGHT}{' '}
          <Text
            style={[styles.error1, {textDecorationLine: 'underline'}]}
            onPress={navigateFaucet}>
            Faucet
          </Text>
        </Text>
      );
    }

    if (
      typeof errorMessage === 'string' &&
      (errorMessage.includes('Faucet') ||
        errorMessage.includes(MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE))
    ) {
      return (
        <Text style={styles.error}>
          Not enough coin to spend, please get some PRV at{' '}
          <Text
            style={[styles.error, {textDecorationLine: 'underline'}]}
            onPress={navigateFaucet}>
            Faucet
          </Text>{' '}
          tab in home screen.
        </Text>
      );
    }
    return errorMessage;
  }, [errorMessage]);
};

const styles = StyleSheet.create({
  error: {
    color: COLORS.red,
    lineHeight: 22,
  },
  error1: {
    color: COLORS.red,
    lineHeight: 16,
    fontSize: 14,
    ...FONTS.STYLE.normal,
  },
});
