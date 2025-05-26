import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import styleSheet from './style';
import { Image, ImageStyle, ViewStyle, StyleProp } from 'react-native';
import { View } from '../core';
import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';

const srcDefaultTokenIcon = require('../../assets/images/icons/default_token_icon.png');

interface TokenInterface {
  iconUrl?: string;
  isVerified?: boolean;
}

interface CryptoIconProps {
  tokenId?: string | null;
  uri?: string | null;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  logoStyle?: StyleProp<ImageStyle>;
  token?: TokenInterface | null;
  showVerifyFlag?: boolean;
}

interface StateType {
  uri: string | null;
  imageComponent: React.ReactNode | null;
  verifiedFlagStyle: StyleProp<ViewStyle> | null;
  verifiedFlagSize: number | null;
}

const getVerifiedFlagStyle = (size: number) => {
  const verifiedFlagSize = Math.round(size * 0.5);
  const verifiedFlagStyle = {
    borderRadius: Math.round(verifiedFlagSize * 0.5),
    bottom: -Math.round(verifiedFlagSize * 0.25),
    right: -Math.round(verifiedFlagSize * 0.25),
    width: verifiedFlagSize + 1,
    height: verifiedFlagSize + 1
  };

  return [verifiedFlagSize, verifiedFlagStyle] as const;
};

const CryptoIcon: React.FC<CryptoIconProps> = ({
  tokenId,
  uri: propUri,
  size = 40,
  containerStyle,
  logoStyle,
  showVerifyFlag = false,
}) => {
  const token = getPrivacyDataByTokenID(tokenId)
  const [state, setState] = useState<StateType>({
    uri: null,
    imageComponent: null,
    verifiedFlagStyle: null,
    verifiedFlagSize: null
  });

  // Calculate verified flag style based on size
  useEffect(() => {
    const [verifiedFlagSize, verifiedFlagStyle] = getVerifiedFlagStyle(size);
    setState(prevState => ({
      ...prevState,
      verifiedFlagStyle,
      verifiedFlagSize
    }));
  }, [size]);

  // Initial URI fetch
  useEffect(() => {
    if (tokenId) {
      getUri(propUri || undefined);
    }
  }, [tokenId, propUri]);

  const getSize = () => {
    return { width: Number(size-1.5), height: Number(size-1.5) };
  };

  const onLoadError = () => {
    setState(prevState => ({ ...prevState, uri: '' }));
  };

  const getUri = async (defaultUri?: string) => {
    const components = (defaultUri || token?.iconUrl || '').split('/');
    const lastComponent = _.last(components);

    if (lastComponent && typeof lastComponent === 'string') {
      components[components.length - 1] = encodeURIComponent(lastComponent);
    }

    const _uri = components.join('/').toLowerCase();

    setState(prevState => 
      prevState.uri !== _uri 
        ? { 
            ...prevState,
            uri: _uri, 
            imageComponent: (
              <Image
                style={[styleSheet.logo, logoStyle, getSize()]}
                source={{ uri: `${_uri}?t=${new Date().getDate()}.${new Date().getHours()}` }}
                onError={onLoadError}
              />
            ) 
          } 
        : prevState
    );
  };

  const renderDefault = (style: StyleProp<ImageStyle>) => (
    <Image
      style={[styleSheet.logo, style, getSize()]}
      source={srcDefaultTokenIcon}
    />
  );

  const { uri, imageComponent, verifiedFlagStyle, verifiedFlagSize } = state;
  const { isVerified } = token || {};

  return (
    <View>
      <View style={[styleSheet.container, containerStyle, { borderRadius: size }, getSize()]}>
        {
          !uri
            ? renderDefault(logoStyle)
            : imageComponent
        }
      </View>
      { showVerifyFlag && isVerified && verifiedFlagSize && (
        <View style={[styleSheet.verifiedFlagContainer, verifiedFlagStyle]}>
          <View>
            <Icon name='check-circle' style={styleSheet.verifiedFlag} size={verifiedFlagSize} />
          </View>
        </View>
      ) }
    </View>
  );
};

CryptoIcon.defaultProps = {
  tokenId: null,
  containerStyle: null,
  logoStyle: null,
  size: 40,
  token: null,
  showVerifyFlag: false,
  uri: null,
};


export default CryptoIcon
