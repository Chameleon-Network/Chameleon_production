import React from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {useDictionary} from '@src/dictionary/hooks';
import {fontNames} from '@src/styles/font';
import {styledValue} from '@src/theme';
import DeviceInfo from 'react-native-device-info';

const Container = styled.View`
  flex: 1;
`;

const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const SorryMessage = styled.Text`
  font-size: 16px;
  color: ${styledValue.text1};
  font-family: ${fontNames.bold};
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: ${styledValue.background6};
  margin-top: 12px;
`;
export const ErrorBoundaryScreen = ({error}: any) => {
  const dict = useDictionary();

  return (
    <Container>
      <ContentContainer>
        <SorryMessage>{dict.SorryError || ''}</SorryMessage>
        <ErrorText>
          {dict.ErrorCode}: {error?.message || ''}
        </ErrorText>
        <ErrorText>
          Device: {Platform.OS.toUpperCase()} - {DeviceInfo.getDeviceNameSync()}
        </ErrorText>
        <ErrorText>Version: {DeviceInfo.getVersion()}</ErrorText>
      </ContentContainer>
    </Container>
  );
};
