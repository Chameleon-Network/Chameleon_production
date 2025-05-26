import { ExHandler } from '@services/exception';
// import withBridgeConnect from '@src/screens/Wallet/features/BridgeConnect/WalletConnect.enhance'; //TODO
import { COLORS } from '@src/styles';
import React, { useState } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { compose } from 'redux';
import { ListItem } from './ListItem';
import { useNavigationParam } from '@src/hooks';
import { Text, View } from '@src/components/core';
import Header from '@src/components/Header/Header';
import { ScrollViewBorder } from '@src/components/core/ScrollView';
import Button from '@src/components/core/Button';
import { useNavigation } from '@react-navigation/native';
import { navigateToShieldGenQRCode } from '@src/router/NavigationServices';

const ChooseNetworkForShield: React.FC = (props) => {
  // get route params
  const tokenInfo = useNavigationParam('tokenSelected', {});

  const getNetworks = () => {
    let networks: any = [];
    if (tokenInfo?.isPUnifiedToken) {
      networks = tokenInfo?.listUnifiedToken;
    } else if (tokenInfo?.tokenId === PRV_ID) {
      networks = tokenInfo?.listChildToken;
    } else {
      networks = [tokenInfo];
    }
    return networks;
  };

  const networks = getNetworks();

  // state
  const [showWalletConnect, setShowWalletConnect] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(
    networks?.length === 1 ? networks[0] : null,
  );
  const [selectedSubView, setSelectedSubView] = useState<
    'GENERATE_ADDRESS' | 'CONNECT_WALLET'
  >('GENERATE_ADDRESS');

  const navigation = useNavigation();

  // Only show Sub View when selected network is Ethereum of Binance Smart Chain
  // const checkShowConnectWallet = (): boolean => {
  //   const isPRV = selectedNetwork?.tokenId === PRV_ID;
  //   if (
  //     selectedNetwork?.isDecentralized &&
  //     !isPRV &&
  //     !isPolygonToken &&
  //     !isFantomToken
  //   ) {
  //     return true;
  //   }
  //   return false;
  // };

  // useEffect(() => {
  //   const isShowWalletConnect = checkShowConnectWallet();
  //   if ((networks?.length === 1 || selectedNetwork) && !isShowWalletConnect) {
  //     setSelectedSubView('GENERATE_ADDRESS');
  //   }
  //   setShowWalletConnect(isShowWalletConnect);
  // }, [selectedNetwork]);

  // Check token belong to Polygon network
  // const isPolygonToken =
  //   selectedNetwork?.isPolygonErc20Token ||
  //   selectedNetwork?.currencyType ===
  //     CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC;

  // // Check token belong to Fantom network
  // const isFantomToken =
  //   selectedNetwork?.isFantomErc20Token ||
  //   selectedNetwork?.currencyType ===
  //     CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM;

  const isDisabledNextButton = () => {
    if (!selectedNetwork || !selectedSubView) return true;
    return false;
  };

  const navigateToShieldGenerateQrCodeScreen = () => {
    const params = {
      parentTokenShield: tokenInfo,
      tokenShield: selectedNetwork,
      selectedTerm: selectedSubView,
    };
    navigateToShieldGenQRCode(params)
  };

  const handleConnectWallet = () => {
    if (typeof props?.handleConnect === 'function') {
      (async () => {
        try {
          const isConnected = await props?.handleConnect?.();
          if (!isConnected) {
            new ExHandler(
              null,
              'WalletConnect connection rejected',
            ).showErrorToast();
            return;
          }
          navigateToShieldGenerateQrCodeScreen();
        } catch (e) {
          new ExHandler(e).showErrorToast();
          return;
        }
      })();
    }
  };

  const onNext = async () => {
    if (showWalletConnect) {
      if (selectedSubView === 'GENERATE_ADDRESS') {
        navigateToShieldGenerateQrCodeScreen();
      }
      if (selectedSubView === 'CONNECT_WALLET') {
        handleConnectWallet();
      }
    } else {
      navigateToShieldGenerateQrCodeScreen();
    }
  };

  const renderSubView = () => {
    let subViewItems = [
      {
        key: 'GENERATE_ADDRESS',
        label: 'Generate a shielding address',
      },
    ];
    if (showWalletConnect) {
      subViewItems.push({
        key: 'CONNECT_WALLET',
        label: `Connect your ${selectedNetwork?.network} wallet`,
      });
    }
    return (
      <View style={subViewContainerStyle}>
        <Text style={descStyle}>
          {showWalletConnect
            ? `To anonymize your coins, you’ll need to send funds to Incognito. You can simply generate a shielding address, or connect directly with the bridge smart contract using your ${selectedNetwork?.network} wallet.`
            : 'To anonymize your coins, you’ll need to send funds to Incognito. You can simply generate a shielding address.'}
        </Text>
        {subViewItems?.map((item: any, i) => {
          return (
            <ListItem
              key={i}
              content={item?.label}
              // disabled={!showWalletConnect || selectedSubView === item?.key}
              // onPress={() => setSelectedSubView(item?.key)}
              selected={selectedSubView === item?.key}
            />
          );
        })}
      </View>
    );
  };

  const renderNetworks = () => {
    return (
      <>
        {networks?.map((item, i) => {
          return (
            <ListItem
              key={i}
              content={item?.network}
              onPress={() => {
                setSelectedNetwork(item);
              }}
              selected={selectedNetwork?.currencyType === item?.currencyType}
              disabled={
                networks?.length === 1 ||
                selectedNetwork?.currencyType === item?.currencyType
              }
            />
          );
        })}
      </>
    );
  };

  return (
    <>
      <Header title={`Shield ${tokenInfo?.symbol}`} />
      <ScrollViewBorder
        style={scrollViewContainerStyle}
        contentContainerStyle={scrollViewContentContainerStyle}
      >
        <Text style={titleStyle}>Choose network type</Text>
        <Text style={descStyle}>
          Please check the selected network if it matches your wallet network,
          or assets might be lost.
        </Text>
        {renderNetworks()}
        {renderSubView()}
      </ScrollViewBorder>
      <View style={bottomButtonContainerStyle}>
        <Button
          title="Next"
          disabled={isDisabledNextButton()}
          onPress={onNext}
          style={buttonStyle}
        />
      </View>
    </>
  );
};

export default React.memo(ChooseNetworkForShield));
  // withBridgeConnect, //TODO 

const scrollViewContainerStyle: ViewStyle = {
  paddingHorizontal: 0,
  paddingVertical: 0,
};

const scrollViewContentContainerStyle: ViewStyle = {
  flexGrow: 1,
  padding: 24,
};

const titleStyle: TextStyle = {
  fontSize: 20,
  fontWeight: '500',
  textAlign: 'center',
  letterSpacing: 0.2,
};

const descStyle: TextStyle = {
  fontSize: 14,
  color: COLORS.lightGrey36,
  marginVertical: 8,
  letterSpacing: 0.2,
};

const bottomButtonContainerStyle: ViewStyle = {
  padding: 24,
};

const buttonStyle: ViewStyle = {
  height: 50,
};

const subViewContainerStyle: ViewStyle = {
  marginTop: 24,
};
