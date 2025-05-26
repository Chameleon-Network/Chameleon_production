import { View2 } from '@components/core/View';
import Clipboard from '@react-native-clipboard/clipboard';
import BtnInfo from '@src/components/Button/BtnInfo';
import { Text, TouchableOpacity, View } from '@src/components/core';
import ScrollView from '@src/components/core/ScrollView/Component';
import Header from '@src/components/Header/Header';
import { CopyIcon, OpenUrlIcon } from '@src/components/Icons';
import { Row } from '@src/components/Row';
import { goBack } from '@src/router/NavigationServices';
import LinkingService from '@src/services/linking';
import ToastService from '@src/services/ToastService';
import { COLORS } from '@src/styles';
import React from 'react';
import withCoinInfo from './CoinInfo.enhance';
import { styled } from './CoinInfo.styled';
import TokenBasic from '@src/components/Token/Token.basic';

const InfoItem = ({ label, value, copyable, link, onlyLabel, labelStyle }) => {
  const renderComponent = (numberOfLinesValue) => (
    <Row style={styled.infoContainer} centerVertical>
      {!!label && (
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={[styled.label, labelStyle]}
        >
          {label}
        </Text>
      )}
      {!!value && (
        <View style={{ flex: 5 }}>
          <Text
            numberOfLines={numberOfLinesValue || 1}
            ellipsizeMode="middle"
            style={styled.value}
          >
            {value}
          </Text>
        </View>
      )}
      {copyable && (
        <TouchableOpacity onPress={handleCopyText}>
          <CopyIcon />
        </TouchableOpacity>
      )}
      {!!link && <OpenUrlIcon />}
    </Row>
  );
  const handleCopyText = () => {
    Clipboard.setString(value);
    ToastService.show('Copied');
  };

  const handleOpenUrl = () => LinkingService.openUrl(link);
  if (!value && !onlyLabel) {
    return null;
  }
  if (copyable && !link) {
    return (
      <TouchableOpacity onPress={handleCopyText}>
        {renderComponent()}
      </TouchableOpacity>
    );
  }
  if (link) {
    return (
      <TouchableOpacity onPress={handleOpenUrl}>
        {renderComponent()}
      </TouchableOpacity>
    );
  }
  return renderComponent(2);
};

const CoinInfo = (props) => {
  const {
    infosFactories,
    tokenId,
    isVerified,
    handlePressVerifiedInfo,
  } = props;
  const onGoBack = () => goBack();
  return (
    <View2 style={styled.container}>
      <Header
        title="Coin info"
        titleStyled={styled.headerTitleStyle}
        onGoBack={onGoBack}
      />
      <View style={[styled.wrapper, {backgroundColor: 'red', marginTop: 0, overflow: 'hidden'}]} borderTop>
        <ScrollView>
          <TokenBasic
            tokenId={tokenId}
            style={styled.token}
            styledContainerName={{
              maxWidth: '100%',
            }}
            styledName={{
              maxWidth: '100%',
            }}
            styledSymbol={{
              maxWidth: '100%',
            }}
          />
          <View style={styled.infoContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styled.label,
                styled.labelIsVerified,
                isVerified ? { color: COLORS.green, width: 65 } : { color: COLORS.orange, width: 90 },
              ]}
            >
              {isVerified ? 'Verified' : 'Unverified'}
            </Text>
            <BtnInfo style={styled.btnInfo} onPress={handlePressVerifiedInfo} />
          </View>
          {infosFactories.map((info, key) => (
            <InfoItem {...info} key={key} />
          ))}
        </ScrollView>
      </View>
    </View2>
  );
};

CoinInfo.defaultProps = {
  info: null,
};

InfoItem.defaultProps = {
  label: '',
  value: '',
  link: '',
  labelStyle: null,
  copyable: false,
  onlyLabel: false,
};

export default withCoinInfo(CoinInfo);
