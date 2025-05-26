import { CONSTANT_COMMONS, CONSTANT_CONFIGS } from '@src/constants';
import { navigateToCoinInfoVerify } from '@src/router/NavigationServices';
import { getTokenInfo } from '@src/services/api/token';
import { selectedPrivacy as selectedPrivacySelector } from '@src/store/selectedPrivacy/selectors';
import format from '@src/utils/format';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import React, { useEffect } from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { useSelector } from 'react-redux';

export const getNetworkName = selectedPrivacy => {
  const {tokenId, networkName, network} = selectedPrivacy;
  let _network = network;
  if (tokenId === PRVIDSTR) {
    _network = networkName;
  }
  return `${_network} network`;
};

const enhance = WrappedComp => props => {
  const [state, setState] = React.useState({
    info: null,
  });
  const {info} = state;

  const selectedPrivacy = useSelector(selectedPrivacySelector);
  const {
    tokenId,
    isVerified,
    isBep2Token,
    contractId,
    pDecimals,
    incognitoTotalSupply,
    externalSymbol,
    symbol,
    listUnifiedToken,
    isPUnifiedToken,
    listChildToken,
  } = selectedPrivacy;

  const getContractLinkByTokenInfo = tokenInfo => {
    if (
      tokenInfo?.isErc20Token ||
      tokenInfo?.isETH ||
      tokenInfo?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20
    ) {
      return `${CONSTANT_CONFIGS.ETHERSCAN_URL}/address/${tokenInfo?.contractId}?from=incognitochain`;
    }
    if (
      tokenInfo?.isBep2Token ||
      tokenInfo?.isBSC ||
      tokenInfo?.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20
    ) {
      return `${CONSTANT_CONFIGS.BSCSCAN_URL}/address/${tokenInfo?.contractId}?from=incognitochain`;
    }
    if (tokenInfo?.isPolygonErc20Token || tokenInfo?.isMATIC) {
      return `${CONSTANT_CONFIGS.POLYGONSCAN_URL}/address/${tokenInfo?.contractId}?from=incognitochain`;
    }
    if (tokenInfo?.isFantomErc20Token || tokenInfo?.isFTM) {
      return `${CONSTANT_CONFIGS.FANTOMSCAN_URL}/address/${tokenInfo?.contractId}?from=incognitochain`;
    }
    if (tokenInfo?.isAvaxErc20Token || tokenInfo?.isAVAX) {
      return `${CONSTANT_CONFIGS.AVAXSCAN_URL}/address/${tokenInfo?.contractId}?from=incognitochain`;
    }
    if (tokenInfo?.isAuroraErc20Token || tokenInfo?.isAURORA_ETH) {
      return `${CONSTANT_CONFIGS.AURORASCAN_URL}/address/${tokenInfo?.contractId}?from=incognitochain`;
    }
    if (tokenInfo?.isNearToken || tokenInfo?.isNEAR) {
      return `${CONSTANT_CONFIGS.NEARSCAN_URL}/address/${tokenInfo?.contractId}?from=incognitochain`;
    }
    return '';
  };

  const getContracts = () => {
    let contractInfos = [];

    if (tokenId === PRVIDSTR) {
      listChildToken?.map(item => {
        contractInfos.push({
          label: `${item?.network} ID`,
          value: item?.contractId,
          link: getContractLinkByTokenInfo(item),
          copyable: true,
        });
      });
    } else if (isPUnifiedToken && listUnifiedToken?.length > 0) {
      listUnifiedToken?.map(item => {
        contractInfos.push({
          label: `${item?.network} ID`,
          value: item?.contractId,
          link: getContractLinkByTokenInfo(item),
          copyable: true,
        });
      });
    } else {
      contractInfos.push({
        label: 'Contract ID',
        value: contractId,
        link: getContractLinkByTokenInfo(selectedPrivacy),
        copyable: true,
      });
    }
    return contractInfos;
  };

  const contracts = getContracts();

  let infosFactories = [
    {
      label: 'Origin',
      value: getNetworkName(selectedPrivacy),
    },
    {
      label: 'Original Ticker',
      value: externalSymbol || symbol,
      link:
        isBep2Token &&
        `${CONSTANT_CONFIGS.BINANCE_EXPLORER_URL}/asset/${externalSymbol}`,
    },

    {
      label: 'Coin ID',
      value: tokenId,
      copyable: true,
    },
    {
      label: 'Coin supply',
      value: incognitoTotalSupply
        ? format.amount(incognitoTotalSupply, pDecimals)
        : null,
    },
    {
      label: 'Owner name',
      value: info?.ownerName,
      copyable: true,
    },
    {
      label: 'Owner address',
      value: info?.ownerAddress,
      copyable: true,
    },
    {label: 'Owner email', value: info?.ownerEmail, copyable: true},
    {
      label: 'Owner website',
      value: info?.ownerWebsite,
      link: info?.ownerWebsite,
    },
  ];

  infosFactories = [...infosFactories, ...contracts];

  const handleGetIncognitoTokenInfo = async () => {
    if (!tokenId) return;
    try {
      const infoData = await getTokenInfo({tokenId});
      await setState({...state, info: infoData});
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    handleGetIncognitoTokenInfo();
  }, [tokenId]);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          infosFactories,
          handlePressVerifiedInfo: navigateToCoinInfoVerify,
          tokenId,
          isVerified,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
