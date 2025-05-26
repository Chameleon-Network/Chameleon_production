import {Text} from '@src/components/core';
import ActivityIndicator from '@src/components/core/ActivityIndicator';
import {PureModalContent} from '@src/components/Modal/features/PureModal';
import {FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'styled-components/native';

const styled = StyleSheet.create({
  desc: {
    ...FONTS.TEXT.incognitoH5,
    textAlign: 'center',
    marginTop: 10,
  },
  sub: {
    ...FONTS.TEXT.incognitoP1,
    textAlign: 'center',
    marginTop: 16,
  },
});

const ModalSwitchingAccount = () => {
  const theme = useTheme();
  return (
    <PureModalContent>
      <ActivityIndicator size="large" />
      <Text style={[styled.desc]}>Switching account...</Text>
      <Text style={[styled.sub, {color: theme.subText}]}>
        Please wait a few minutes
      </Text>
    </PureModalContent>
  );
};

export default React.memo(ModalSwitchingAccount);
