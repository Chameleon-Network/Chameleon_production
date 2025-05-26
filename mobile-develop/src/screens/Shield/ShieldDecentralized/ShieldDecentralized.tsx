import { View, View2 } from '@components/core/View';
import React, { memo } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';

import { ExHandler } from '@services/exception';
import ActivityIndicator from '@src/components/core/ActivityIndicator';
import { CONSTANT_COMMONS } from '@src/constants';
import { navigateToWalletDetail } from '@src/router/NavigationServices';
import ExtraInfo from '@src/screens/DexV2/ExtraInfo';
import { COLORS, FONTS, verticalScale } from '@src/styles';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { isEmpty } from 'lodash';
import { useTheme } from 'styled-components/native';
import { styled } from '../GenQRCode/GenQRCode.styled';
import {
  SHIELD_BUTTON_TITLE,
  SHIELD_MESSAGE,
} from './ShieldDecentralized.constants';
import { Row } from '@src/components/Row';
import { BaseTextInput } from '@src/components/core/BaseTextInput';
import { ScrollViewBorder } from '@src/components/core/ScrollView';
import Header from '@src/components/Header/Header';
import { Text } from '@src/components/core';
import ButtonBasic from '@src/components/Button/ButtonBasic';
import RoundCornerButton from '@src/components/core/RoundCornerButton';
import SuccessModal from '@src/components/SuccessModal';
import { BtnInfinite } from '@src/components/Button/BtnInfinite';
import withBridgeConnect from '@src/screens/Wallet/BridgeConnect/WalletConnect.enhance'

interface ShieldDecentralizedProps {
  account: object;
  handleGetBalance: () => void;
  handleDisconnect: () => void;
  handleConnect: () => void;
  handleDepositETH: () => void;
  isApprovedFunc: boolean;
  handleApproveERC20: () => void;
  handleDepositERC20: () => void;
  handleGetNonce: () => void;
  selectedPrivacy: object;
}

const ShieldDecentralized = (props: ShieldDecentralizedProps) => {
  const {
    account,
    handleGetBalance,
    handleDisconnect,
    handleConnect,
    handleDepositETH,
    isApprovedFunc,
    handleApproveERC20,
    handleDepositERC20,
    handleGetNonce,
    selectedPrivacy,
  } = props;

  // state
  const [balanceLoaded, setLoadBalance] = React.useState(undefined);
  const [shieldAmount, setShieldAmount] = React.useState('');
  const [shieldTxHash, setShieldTxHash] = React.useState(undefined);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  // selector
  const connector = useWalletConnect();
  const { externalSymbol, contractId } = selectedPrivacy;
  const isBSC =
    selectedPrivacy?.currencyType ===
    CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB ||
    selectedPrivacy?.currencyType ===
    CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20;
  const isNativeToken =
    selectedPrivacy?.currencyType ===
    CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH ||
    selectedPrivacy?.currencyType ===
    CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB;
  const tokenIDInput = React.useMemo(() => {
    return contractId ? contractId : CONSTANT_COMMONS.ETH_TOKEN_ADDRESS;
  }, [contractId]);

  const isConnect = React.useMemo(() => {
    return (
      connector.connected && connector.accounts && connector.accounts.length > 0
    );
  }, [connector]);

  const shieldButtonText = React.useMemo(() => {
    if (!isConnect) return SHIELD_BUTTON_TITLE.CONNECT;
    return isNativeToken
      ? SHIELD_BUTTON_TITLE.SHIELD
      : SHIELD_BUTTON_TITLE.APPROVE_SHIELD;
  }, [externalSymbol, isConnect]);
  const theme = useTheme()

  const handleShield = () => {
    setIsPressed(true);
    const convertShieldAmount = shieldAmount.replace(',', '.');
    let shieldAmountNum = parseFloat(convertShieldAmount);
    if (connector.accounts.length > 0 && shieldAmountNum <= balanceLoaded) {
      (async () => {
        let tx;
        let nonce = -1;
        try {
          if (isNativeToken) {
            tx = await handleDepositETH(
              shieldAmountNum,
              connector.accounts[0],
              account?.PaymentAddress,
              isBSC,
            );
            setShieldTxHash(tx);
          } else {
            const isApproved = await isApprovedFunc(
              shieldAmountNum,
              tokenIDInput,
              connector.accounts[0],
              isBSC,
            );
            if (!isApproved) {
              nonce = await handleGetNonce(connector.accounts[0], isBSC);
              await handleApproveERC20(
                tokenIDInput,
                connector.accounts[0],
                nonce++,
                isBSC,
              );
            }
            tx = await handleDepositERC20(
              shieldAmountNum,
              tokenIDInput,
              connector.accounts[0],
              account?.PaymentAddress,
              nonce,
              isBSC,
            );
            setIsRejected(false);
            setShieldTxHash(tx);
          }
        } catch (e) {
          const errMess = e.message;
          if (errMess.toLowerCase().indexOf('user rejected') !== -1) {
            setIsRejected(true);
          } else {
            new ExHandler().showErrorToast();
          }
        }
      })();
      setTimeout(() => {
        setIsPressed(false);
      }, 1500);
    } else {
      console.log('Wallet not connected or invalid input amount');
      setIsPressed(false);
    }
  };

  const web3LoadBalance = async () => {
    const balance = await handleGetBalance(
      tokenIDInput,
      connector.accounts[0],
      isBSC,
    );
    setLoadBalance(balance);
  };

  const onMainBtnPress = () => {
    if (isConnect) {
      return handleShield();
    }
    if (typeof handleConnect === 'function') {
      handleConnect();
    }
  };

  const onCloseSuccessModel = () => {
    setShieldTxHash(false);
    navigateToWalletDetail()
  };

  const renderBalance = () => {
    const right =
      balanceLoaded === undefined ? (
        <View style={{ maxWidth: 50, alignSelf: 'flex-end' }}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        `${balanceLoaded} ${externalSymbol}`
      );
    return <ExtraInfo left="Balance" right={right} style={styles.extra} />;
  };

  const renderContent = () => (
    <View style={{ marginTop: 20 }}>
      <Row center spaceBetween style={styles.inputContainer}>
        <BaseTextInput
          style={styles.input}
          placeholder="0"
          onChangeText={(amount) => setShieldAmount(amount)}
          value={shieldAmount}
          editable={isConnect}
          keyboardType="decimal-pad"
        />
        <BtnInfinite
          onPress={() => {
            if (!balanceLoaded) return;
            setShieldAmount(`${balanceLoaded}`);
          }}
          style={[styles.symbol, !balanceLoaded && { opacity: 0.4 }]}
        />
      </Row>
      <RoundCornerButton
        onPress={onMainBtnPress}
        title={shieldButtonText}
        style={styled.btnShield}
        disabled={isPressed}
      />
      <View style={styled.wrapMessage}>
        {!isEmpty(shieldTxHash) && (
          <SuccessModal
            closeSuccessDialog={onCloseSuccessModel}
            title={SHIELD_MESSAGE.SHIELD_SUCCESS_TITLE}
            buttonTitle="Sure thing"
            visible={!!shieldTxHash}
            description={SHIELD_MESSAGE.SHIELD_SUCCESS_MESS}
          />
        )}
        {isRejected && (
          <Text style={[styled.shieldMessage, { color: COLORS.red }]}>
            {SHIELD_MESSAGE.REJECTED_MESS}
          </Text>
        )}
        <Text style={styled.shieldMessage}>
          {SHIELD_MESSAGE.NOTE_MESSAGE}
        </Text>
      </View>
      <View style={{ marginTop: 15 }}>
        {isConnect && (
          <>
            <ExtraInfo
              left="Address"
              right={connector.accounts[0]}
              style={styles.extra}
              rightStyle={{ maxWidth: 200 }}
              ellipsizeMode="middle"
            />
            {renderBalance()}
          </>
        )}
      </View>
    </View>
  );

  const onConnectorPress = () => {
    if (
      typeof handleConnect === 'function' &&
      typeof handleDisconnect === 'function'
    ) {
      if (isConnect) {
        handleDisconnect();
      } else {
        handleConnect();
      }
    }
  };

  const renderRightHeader = () => {
    if (!isConnect) return null;
    return (
      <View styles={styled.wrapConnect}>
        <ButtonBasic
          onPress={onConnectorPress}
          customContent={(
            <Text
              numberOfLines={1}
              style={styled.connectStyle}
              ellipsizeMode="tail"
            >
              {SHIELD_BUTTON_TITLE.DISCONNECT}
            </Text>
          )}
          btnStyle={[styled.btnConnect, { backgroundColor: theme.background8 }]}
        />
      </View>
    );
  };

  const handleRefresh = async () => {
    if (!connector || !connector.connected || isEmpty(connector.accounts))
      return;
    try {
      setRefresh(true);
      setLoadBalance(undefined);
      await web3LoadBalance();
    } catch (error) {
      console.log('Web3 load balance error: ', error);
    } finally {
      setRefresh(false);
    }
  };

  React.useEffect(() => {
    if (!connector || !connector.connected || isEmpty(connector.accounts))
      return;
    web3LoadBalance().then();
  }, [connector, tokenIDInput]);

  return (
    <View2 style={{ flex: 1 }}>
      <Header
        title={`Shield ${externalSymbol}`}
        rightHeader={renderRightHeader()}
      />
      <ScrollViewBorder
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      >
        {renderContent()}
      </ScrollViewBorder>
    </View2>
  );
};



export default withBridgeConnect(memo(ShieldDecentralized));

const styles = StyleSheet.create({
  button: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(16),
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedButton: {
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 0,
    marginBottom: 5,
  },
  unSelectedButon: {
    paddingVertical: 7,
    borderRadius: 16,
    marginBottom: 5,
  },
  textLeft: {
    fontFamily: FONTS.NAME.specialMedium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.medium + 4,
  },
  textRight: {
    marginLeft: 10,
    tintColor: COLORS.green,
    color: COLORS.green,
  },
  input: {
    fontFamily: FONTS.NAME.medium,
    fontSize: 26,
    height: 52,
    padding: 0,
    flex: 1,
    marginRight: 15,
    marginBottom: -8,
  },
  inputContainer: {
    marginBottom: 8,
    paddingVertical: 13,
    borderRadius: 8,
  },
  symbol: {
    fontSize: 20,
    fontFamily: FONTS.NAME.bold,
  },
})