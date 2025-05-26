/* eslint-disable import/no-cycle */
import {CONSTANT_COMMONS, CONSTANT_CONFIGS} from '@src/constants';
import {BIG_COINS, PRV_ID} from '@src/screens/Dex/constants';
import {detectToken} from '@src/utils/misc';
import {PRV} from '@src/constants/common';
import PToken from './pToken';

function getNetworkName(data: any) {
  let name = 'Unknown';
  // Native token of Ethereum network
  const isETH =
  data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH;
  // Native token of Binance Smart Chain network
  const isBSC =
  data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB;
  // Native token of Binance Chain network
  const isBNB =
  data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB;
  // Native token of Polygon network
  const isMATIC =
  data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC;
  // Native token of Fantom network
  const isFTM =
  data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM;

  const isAVAX =
  data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AVAX;

  const isAURORA_ETH =
  data?.currencyType ===
    CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AURORA_ETH;

  // Native token of Near network
  const isNEAR =
  data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.NEAR;
  if (isBSC) {
    name = 'BSC';
  } else if (isBNB) {
    name = 'BNB Chain';
  } else if (
    data.isIncognitoToken ||
    data.isMainCrypto ||
    data.isPUnifiedToken
  ) {
    name = 'Incognito';
  } else if (data.isPrivateCoin) {
    name = `${data.name}`;
  } else if (data.isErc20Token) {
    name = 'ERC20';
  } else if (data.isBep20Token) {
    name = 'BEP20';
  } else if (data.isBep2Token) {
    name = 'BEP2';
  } else if (data.isPolygonErc20Token) {
    name = 'Polygon ERC20';
  } else if (data.isFantomErc20Token) {
    name = 'Fantom ERC20';
  } else if (data.isAvaxErc20Token) {
    name = 'Avax ERC20';
  } else if (data.isAuroraErc20Token) {
    name = 'Aurora ERC20';
  } else if (data.isNearToken) {
    name = 'NEAR TOKEN';
  } else if (data.isIncognitoToken || data.isMainCrypto) {
    name = 'Incognito';
  }

  let rootNetworkName = name;
  if (isETH || data?.isErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.ETHEREUM;
  } else if (isBSC || data?.isBep20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.BSC;
  } else if (isBNB || data?.isBep2Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.BINANCE;
  } else if (isMATIC || data?.isPolygonErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.POLYGON;
  } else if (isFTM || data?.isFantomErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.FANTOM;
  } else if (isAVAX || data?.isAvaxErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.AVAX;
  } else if (isAURORA_ETH || data?.isAuroraErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.AURORA;
  } else if (isNEAR || data?.isNearToken) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.NEAR;
  }
  return {
    networkName: name,
    rootNetworkName,
  };
}

function getGroupNetworkName(data: any) {
  switch (data.currencyType) {
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH:
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.ETHEREUM;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB:
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.BSC;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC:
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.POLYGON;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM:
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FANTOM_ERC20:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.FANTOM;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.UNIFIED_TOKEN:
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.PRV:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.INCOGNITO;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AURORA_ETH:
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AURORA_ERC20:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.AURORA;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AVAX:
    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AVAX_ERC20:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.AVAX;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BTC:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.BTC;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.DASH:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.DASH;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.DOGE:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.DOGE;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.DOT:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.DOT;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.LTC:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.LTC;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.NEO:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.NEO;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.TOMO:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.TOMO;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.XMR:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.XMR;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ZEC:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.ZEC;

    case CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ZIL:
      return CONSTANT_COMMONS.MAIN_NETWORK_NAME.ZIL;

    default:
      return '';
  }
}

function combineData(data: any, pData: any, incognitoData: any, defaultData: any) {
  if (data?.isPToken) {
    return pData || incognitoData;
  }

  if (data?.isIncognitoToken) {
    return incognitoData || pData;
  }

  return defaultData;
}

function getIconUrl(data: any, chainTokenImageUri: string) {
  let uri;

  if (data.tokenId === PRV_ID) {
    return 'https://statics.incognito.org/wallet/cryptocurrency-icons/32@2x/color/prv@2x.png';
  }

  if (data.symbol === PRV.symbol) {
    return null;
  }

  if (data.isMainCrypto || data.isPToken) {
    let formatedSymbol = String(
      data.symbol || data.externalSymbol,
    ).toUpperCase();
    uri = `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${formatedSymbol}.png`;
  } else {
    uri = chainTokenImageUri;
  }

  return uri;
}

class SelectedPrivacy {
  isSelectedPrivacyModal?: boolean;
  currencyType?: string | number;
  isToken?: boolean;
  isMainCrypto?: boolean;
  isPrivateToken?: boolean;
  isPrivateCoin?: boolean;
  isPToken?: boolean;
  isPUnifiedToken?: boolean;
  isIncognitoToken?: boolean;
  isErc20Token?: boolean;
  isBep2Token?: boolean;
  isPolygonErc20Token?: boolean;
  isFantomErc20Token?: boolean;
  isNearToken?: boolean;
  isAvaxErc20Token?: boolean;
  isAuroraErc20Token?: boolean;
  isBep20Token?: boolean;
  symbol?: string;
  name?: string;
  shortName?: string;
  displayName?: string;
  tokenId?: string;
  contractId?: string;
  decimals?: number;
  pDecimals?: number;
  externalSymbol?: string;
  paymentAddress?: string;
  isWithdrawable?: boolean;
  isDeposable?: boolean;
  isDecentralized?: boolean;
  isCentralized?: boolean;
  incognitoTotalSupply?: number;
  isVerified?: boolean;
  priceUsd?: number;
  externalPriceUSD?: number;
  pricePrv?: number;
  pairWithPrv?: boolean;
  networkName?: string;
  rootNetworkName?: string;
  isUSDT?: boolean;
  isPRV?: boolean;
  amount?: number;
  listChildToken?: any[];
  iconUrl?: string;
  change?: string;
  defaultPoolPair?: any;
  defaultPairToken?: any;
  network?: string;
  networkId?: string;
  hasSameSymbol?: boolean;
  listUnifiedToken?: any[];
  movedUnifiedToken?: any;
  parentUnifiedID?: string;
  listUnifiedTokenCurrencyType?: string[];
  isETH?: boolean;
  isBSC?: boolean;
  isBNB?: boolean;
  isMATIC?: boolean;
  isFTM?: boolean;
  isAVAX?: boolean;
  isAURORA_ETH?: boolean;
  isNEAR?: boolean;
  groupNetworkName?: string;
  
  constructor(account: any = {}, token: any = {}, pTokenData: PToken, _tokenID: any) {
    const tokenId = pTokenData?.tokenId || token?.id;
    const isUnknown = _tokenID !== PRV_ID && !tokenId;
    const unknownText = 'Incognito Token';

    this.isSelectedPrivacyModal = true;

    this.currencyType = pTokenData.currencyType;
    this.isToken = tokenId !== CONSTANT_COMMONS.PRV_TOKEN_ID && !!tokenId; // all kind of tokens (private tokens, incognito tokens)
    this.isMainCrypto = _tokenID === PRV_ID; // PRV
    this.isPrivateToken =
      pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.TOKEN; // ERC20 tokens, BEP2 tokens
    this.isPrivateCoin =
      pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.COIN; // pETH, pBTC, pTOMO,...
    this.isPToken = !!pTokenData.pSymbol; // pToken is private token (pETH <=> ETH, pBTC <=> BTC, ...)
    this.isPUnifiedToken =
      this.currencyType ===
      CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.UNIFIED_TOKEN; // pToken is private token (pETH <=> ETH, pBTC <=> BTC, ...)
    this.isIncognitoToken =
      (!this.isPToken && !this.isMainCrypto) ||
      detectToken.ispNEO(this?.tokenId); // is tokens were issued from users
    this.isErc20Token =
      this.isPrivateToken &&
      this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
    this.isBep2Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB_BEP2;
    this.isPolygonErc20Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20;
    this.isFantomErc20Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FANTOM_ERC20;
    this.isNearToken =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.NEAR_TOKEN;
    this.isAvaxErc20Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AVAX_ERC20;
    this.isAuroraErc20Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AURORA_ERC20;
    this.isBep20Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20;
    this.symbol = combineData(
      this,
      pTokenData?.pSymbol,
      token?.symbol,
      CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    );
    this.name = combineData(
      this,
      pTokenData?.name,
      token?.name,
      isUnknown ? unknownText : 'Privacy',
    );
    this.shortName = this.name;
    if (this.name && this.name.includes('(')) {
      const splitArr_1 = this.name.split('(');
      const splitArr_2 = this.name.split(')');
      if (splitArr_1[0] && splitArr_1[0].trim()) {
        this.shortName = splitArr_1[0];
      } else if (splitArr_2[1]) {
        this.shortName = splitArr_2[1];
      }
    }
    this.displayName = combineData(
      this,
      `Privacy ${pTokenData?.symbol}`,
      token?.name,
      isUnknown ? unknownText : 'Privacy',
    );

    this.tokenId = _tokenID
      ? _tokenID
      : this.isMainCrypto
      ? CONSTANT_COMMONS.PRV_TOKEN_ID
      : tokenId;
    this.contractId = pTokenData.contractId;
    this.decimals = this.isMainCrypto
      ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
      : pTokenData.decimals;
    this.pDecimals = this.isMainCrypto
      ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
      : pTokenData.pDecimals || 0;
    this.externalSymbol = pTokenData.symbol;
    this.paymentAddress = account.PaymentAddress;
    this.isWithdrawable = this.isPToken;
    this.isDeposable = this.isPToken;
    this.isDecentralized =
      this.isPUnifiedToken ||
      this.isErc20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH) ||
      this.isBep20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB) ||
      this.isPolygonErc20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC) ||
      this.isFantomErc20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM) ||
      this.isNearToken ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.NEAR) ||
      this.isAvaxErc20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AVAX) ||
      this.isAuroraErc20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AURORA_ETH);
    this.isCentralized = this.isToken && !this.isDecentralized;
    this.incognitoTotalSupply =
      (this.isIncognitoToken && Number(token?.totalSupply)) || 0;
    this.isVerified = combineData(
      this,
      pTokenData?.verified,
      token?.verified,
      !isUnknown,
    ); // PRV always is verified
    this.priceUsd = pTokenData?.priceUsd || 0;
    this.externalPriceUSD = pTokenData?.externalPriceUSD || 0;
    this.pricePrv = pTokenData?.pricePrv || 0;
    this.pairWithPrv = pTokenData?.pairPrv;
    const {networkName, rootNetworkName} = getNetworkName(this);
    this.networkName = networkName;
    this.rootNetworkName = rootNetworkName;
    this.isUSDT = this.tokenId === BIG_COINS.USDT;
    this.isPRV = this.tokenId === BIG_COINS.PRV;
    this.symbol = this.externalSymbol || this.symbol || '';
    if (!this.symbol && this.isIncognitoToken && !this.isMainCrypto) {
      this.symbol = 'INC';
    }
    this.amount = token?.amount;
    if (this.isMainCrypto) {
      this.amount = account?.value;
      this.symbol = CONSTANT_COMMONS.PRV.symbol;
    }
    this.amount = this.amount || 0;
    this.listChildToken = pTokenData?.listChildToken;
    this.iconUrl = getIconUrl(this, token?.image || pTokenData.image) || '';
    this.change = pTokenData?.change;
    this.defaultPoolPair = pTokenData?.defaultPoolPair;
    this.defaultPairToken = pTokenData?.defaultPairToken;
    this.network = pTokenData.network;
    this.networkId = pTokenData.networkId;
    // if (tokenId === PRV_ID) {
    //   this.network = 'Incognito';
    // }
    this.hasSameSymbol = pTokenData.hasSameSymbol;

    // Unified Token
    this.listUnifiedToken = pTokenData?.listUnifiedToken || [];
    this.movedUnifiedToken = pTokenData?.movedUnifiedToken;
    this.parentUnifiedID = pTokenData?.parentUnifiedID;
    this.listUnifiedTokenCurrencyType = this.isPUnifiedToken
      ? this.listUnifiedToken.map(token => token.currencyType)
      : [];
    this.listUnifiedToken = this.listUnifiedToken.map(child => {
      return {
        ...child,
        groupNetworkName: getGroupNetworkName(child),
      };
    });

    // Native Token of Network
    this.isETH =
      this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH;
    this.isBSC =
      this?.currencyType ===
      CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB;
    this.isBNB =
      this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB;
    this.isMATIC =
      this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC;
    this.isFTM =
      this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.FTM;
    this.isAVAX =
      this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AVAX;
    this.isAURORA_ETH =
      this?.currencyType ===
      CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.AURORA_ETH;
    this.isNEAR =
      this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.NEAR;

    // groupByNetwork
    this.groupNetworkName = getGroupNetworkName(this);
  }
}

export default SelectedPrivacy;
