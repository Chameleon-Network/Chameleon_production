import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {PermissionWrapper} from '@src/components/PermissionWraper';
import {useDictionary} from '@src/dictionary/hooks';
import {QrCodeRouteParams} from '@src/router/types';
import {styledValue} from '@src/theme';
import React, {memo, useEffect, useRef, useState} from 'react';
import {Camera} from 'react-native-camera-kit';
import {PERMISSIONS} from 'react-native-permissions';
import styled from 'styled-components/native';

export const QrCodeScannerScreen = memo(function QrCodeScannerScreen() {
  const [isMounted, setMounted] = useState(false);
  const isScanned = useRef(false);
  const isFocused = useIsFocused();
  const dict = useDictionary();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as QrCodeRouteParams | undefined;
  const callback = params?.callback;

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 500);
  }, []);

  const onScanResult = (event: any) => {
    if (isScanned.current) {
      return;
    }
    isScanned.current = true;

    const val = event?.nativeEvent?.codeStringValue || '';

    if (!val) {
      isScanned.current = false;
      return;
    }

    // Return the scanned value to the calling screen through callback or params
    if (callback && typeof callback === 'function') {
      callback(val);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
      // Pass the scanned value back to the previous screen
      if (params?.onScanComplete) {
        params.onScanComplete(val);
      }
    }
  };

  return (
    <Container>
      {isMounted ? (
        <PermissionWrapper
          permission={PERMISSIONS.IOS.CAMERA}
          style={{flex: 1}}>
          <PermissionWrapper
            permission={PERMISSIONS.ANDROID.CAMERA}
            style={{flex: 1}}>
            <ContentContainer>
              {isFocused && !isScanned.current ? (
                <Camera
                  style={{
                    flex: 1,
                    width: '100%',
                  }}
                  scanBarcode={true}
                  showFrame={true}
                  onReadCode={onScanResult}
                  laserColor={'#cf3737'}
                  frameColor="white"
                />
              ) : null}
            </ContentContainer>
          </PermissionWrapper>
        </PermissionWrapper>
      ) : null}
    </Container>
  );
});

const Container = styled.View`
  flex: 1;
  background-color: ${styledValue.background1};
`;

const ContentContainer = styled.View`
  flex: 1;
  background-color: ${styledValue.background1};
  align-items: center;
  justify-content: center;
`;

export default QrCodeScannerScreen;
