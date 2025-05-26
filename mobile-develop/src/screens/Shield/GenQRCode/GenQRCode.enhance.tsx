import BtnInfo from '@src/components/Button/BtnInfo';
import { LoadingContainer } from '@src/components/core';
import Header from '@src/components/Header/Header';
import withLazy from '@src/components/LazyHoc/withLazy';
import { CONSTANT_COMMONS } from '@src/constants';
import { useNavigationParam } from '@src/hooks';
import useDebounceSelector from '@src/hooks/useDebounceSelector';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { goBack, navigateToCoinInfo } from '@src/router/NavigationServices';
import { wcProviderOptionals } from '@src/screens/Wallet/BridgeConnect';
import { defaultAccount } from '@src/store/account/selectors';
import { setChildSelectedPrivacy } from '@src/store/childSelectedPrivacy';
import { isLoadingAllMasterKeyAccountSelector } from '@src/store/masterKey/selectors';
import { setSelectedPrivacy } from '@src/store/selectedPrivacy';
import { getDefaultAccountWalletSelector } from '@src/store/shared/selectors';
import { actionFetch as actionFetchShield, actionReset, actionPortalFetch as fetchPortalDataShield } from '@src/store/shield/functions';
import { shieldDataSelector, shieldSelector } from '@src/store/shield/selectors';
import { actionAddFollowToken } from '@src/store/token/functions';
import { THEME_KEYS } from '@src/theme/theme.consts';
import { themeModeSelector } from '@src/theme/theme.selector';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { batch, useSelector } from 'react-redux';
import ShieldDecentralized from '../ShieldDecentralized';
import { styled } from './GenQRCode.styled';

const enhance = (WrappedComp) => (props) => {
  //With Account Enhance
  const account = useSelector(defaultAccount);
  const loading = useSelector(isLoadingAllMasterKeyAccountSelector);
  if (loading) {
    return (
      <>
        <Header title="Node" style={{ marginHorizontal: 25 }} />
        <LoadingContainer />
      </>
    );
  }
  // End of WithAcoountEnhance

  const accountWallet = useDebounceSelector(getDefaultAccountWalletSelector);
  const token = useNavigationParam('tokenShield', {}) || {};
  const tokenShield = token?.isSelectedPrivacyModal ? token : new SelectedPrivacy(
    account,
    {},
    token,
    token.tokenId,
  );

  const parentTokenShield = useNavigationParam('parentTokenShield', {}) || {};
  const tokenSymbol = tokenShield?.externalSymbol || tokenShield?.symbol;
  const { tokenId } = tokenShield;
  const { decentralized } = useDebounceSelector(shieldDataSelector);
  const { isFetching, isFetched } =
    useDebounceSelector(shieldSelector);
  const handleShield = async () => {
    const isPortalToken = await accountWallet.handleCheckIsPortalToken({
      tokenID: tokenId,
    });
    if (isPortalToken) {
        fetchPortalDataShield({
          tokenID: tokenId,
          selectedPrivacy: tokenShield,
          account,
          accountWallet,
        })
    } else {
      actionFetchShield({ tokenId, selectedPrivacy: tokenShield, account })
    }
  };

  const handleUpdateTokenSelector = () => {
    batch(() => {
      setSelectedPrivacy(parentTokenShield?.tokenId)
      setChildSelectedPrivacy(tokenShield)
      actionAddFollowToken(parentTokenShield?.tokenId)
    });
  };

  React.useEffect(() => {
    setTimeout(() => {
      handleUpdateTokenSelector();
    }, 1000);

    // reset shield data when unmounting
    return () => {
      actionReset()
    };
  }, []);

  const { currencyType } = tokenShield;
  const selectedTerm = useNavigationParam('selectedTerm', '');

  const handleToggleTooltip = () => {
    navigateToCoinInfo({ decentralized })
  };
  const hasError = !isFetched && !isFetching;
  
  const handleGoBack = () => {
    return goBack();
  };
  const themeMode = useSelector(themeModeSelector);
  const renderHeader = React.useCallback(
    () => (
      <Header
        title={`Shield ${tokenSymbol}`}
        titleStyled={styled.titleStyled}
        rightHeader={(
          <BtnInfo
            isBlack={themeMode !== THEME_KEYS.DARK_THEME}
            onPress={handleToggleTooltip}
          />
        )}
        onGoBack={handleGoBack}
      />
    ),
    [tokenSymbol],
  );

  const renderLoading = React.useCallback(
    () => (
      <>
        {renderHeader()}
        <LoadingContainer />
      </>
    ),
    [],
  );

  React.useEffect(() => {
    if (
      (!CONSTANT_COMMONS.CURRENCY_TYPE_BRIDGE.includes(currencyType) &&
        !selectedTerm) ||
      (selectedTerm === 'GENERATE_ADDRESS' &&
        typeof handleShield === 'function')
    ) {
      handleShield();
    }
  }, [selectedTerm]);

  /** render loading */
  if (isFetching) {
    return renderLoading();
  }

  if (selectedTerm === 'CONNECT_WALLET') {
    return <ShieldDecentralized {...{ ...props }} />;
  }

  return (
    <WalletConnectProvider {...wcProviderOptionals}>
      <ErrorBoundary>
        {renderHeader()}
        <WrappedComp
          {...{
            ...props,
            isFetching,
            isFetched,
            hasError,
          }}
        />
      </ErrorBoundary>
    </WalletConnectProvider>
  );
};

export default withLazy(enhance);
