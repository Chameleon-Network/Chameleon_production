import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {ROUTE_NAMES} from './routeNames';

export const navigationRef = createNavigationContainerRef();

export const navigation = () => navigationRef;

export const getCurrentScreen = navigationRef.current?.getCurrentRoute()?.name;

export const createNavigate =
  <T extends object>(screenName: string) =>
  (params?: T) => {
    // @ts-ignore
    navigation().navigate(screenName, params);
  };

export const createPush =
  <T extends object>(screenName: string) =>
  (params?: T) => {
    return navigation().dispatch(StackActions.push(screenName, params));
  };

export const createReplace =
  <T extends object>(screenName: string) =>
  (params?: T) => {
    return navigation().dispatch(StackActions.replace(screenName, params));
  };

export const createReset =
  <T extends object>(screenName: string) =>
  (params?: T) => {
    return navigation().dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: screenName, params: params}],
      }),
    );
  };

export const canGoBack = () => navigation().canGoBack();

export const goBack = () => navigation().goBack();

export const navigateToMainTabBar = createNavigate(ROUTE_NAMES.MainTabBar);
export const navigateToGetStarted = createNavigate(ROUTE_NAMES.GetStarted);
export const navigateToSelectAccount = createNavigate(
  ROUTE_NAMES.SelectAccount,
);
export const navigateToWebview = createNavigate(ROUTE_NAMES.WebView);
export const navigateToInitImportMasterKey = createNavigate(
  ROUTE_NAMES.InitImportMasterKey,
);
export const navigateToInitMasterKey = createNavigate(
  ROUTE_NAMES.InitMasterKey,
);

export const navigateToBackupKeys = createNavigate(ROUTE_NAMES.BackupKeys);
export const navigateToExportAccountModal = createNavigate(
  ROUTE_NAMES.ExportAccountModal,
);
export const navigateToExportAccount = createNavigate(
  ROUTE_NAMES.ExportAccount,
);

export const navigateToInitMasterKeyPhrase = createNavigate(
  ROUTE_NAMES.InitMasterKeyPhrase,
);
export const navigateToMasterKeyPhrase = createNavigate(
  ROUTE_NAMES.MasterKeyPhrase,
);
export const navigateToInitVerifyPassphrase = createNavigate(
  ROUTE_NAMES.InitVerifyPassphrase,
);
export const navigateToVerifyPassphrase = createNavigate(
  ROUTE_NAMES.VerifyPassphrase,
);
export const navigateToTutorial = createNavigate(ROUTE_NAMES.Tutorial);
export const navigateToMasterKeys = createNavigate(ROUTE_NAMES.MasterKeys);
export const navigateToQRCodeScanner = createNavigate(
  ROUTE_NAMES.QRCodeScanner,
);
export const navigateToAddPin = createNavigate(ROUTE_NAMES.AddPin);
export const navigateToRefillPRVModal = createNavigate(ROUTE_NAMES.Trade);
export const navigateToCreateMasterKey = createNavigate(
  ROUTE_NAMES.CreateMasterKey,
);
export const navigateToImportMasterKey = createNavigate(
  ROUTE_NAMES.ImportMasterKey,
);
export const navigateToKeysExplained = createNavigate(
  ROUTE_NAMES.KeysExplained,
);
export const navigateToKeychain = createNavigate(ROUTE_NAMES.Keychain);
export const navigateToTrade = createNavigate(ROUTE_NAMES.Trade);
export const navigateToMarketSearchCoins = createNavigate(
  ROUTE_NAMES.MarketSearchCoins,
);

export const navigateToNews = createNavigate(ROUTE_NAMES.News);
export const navigateToChooseNetworkForShield = createNavigate(
  ROUTE_NAMES.ChooseNetworkForShield,
);

export const navigateToCoinInfo = createNavigate(ROUTE_NAMES.CoinInfo);
export const navigateToCommunity = createNavigate(ROUTE_NAMES.Community);
export const navigateToWhyShield = createNavigate(ROUTE_NAMES.WhyShield);
export const navigateToImportAccount = createNavigate(
  ROUTE_NAMES.ImportAccount,
);
export const navigateToCreateAccount = createNavigate(
  ROUTE_NAMES.CreateAccount,
);
export const navigateToStandby = createNavigate(ROUTE_NAMES.Standby);
export const navigateToOrderLimit = createNavigate(ROUTE_NAMES.OrderLimit);
export const navigateToNFTToken = createNavigate(ROUTE_NAMES.NFTToken);

export const navigateToSend = createNavigate(ROUTE_NAMES.Send);
export const navigateToReceiveCrypto = createNavigate(
  ROUTE_NAMES.ReceiveCrypto,
);
export const navigateToWallet = createNavigate(ROUTE_NAMES.Wallet);
export const navigateToTxHistoryDetail = createNavigate(
  ROUTE_NAMES.TxHistoryDetail,
);
export const navigateToShieldRefund = createNavigate(ROUTE_NAMES.ShieldRefund);
export const navigateToWalletDetail = createNavigate(ROUTE_NAMES.WalletDetail);
export const navigateToAddManually = createNavigate(ROUTE_NAMES.AddManually);
export const navigateToFollowToken = createNavigate(ROUTE_NAMES.FollowToken);
export const navigateToShield = createNavigate(ROUTE_NAMES.Shield);
export const navigateToCoinInfoVerify = createNavigate(
  ROUTE_NAMES.CoinInfoVerify,
);
export const navigateToShieldGenQRCode = createNavigate(
  ROUTE_NAMES.ShieldGenQRCode,
);
export const navigateToContributePool = createNavigate(
  ROUTE_NAMES.ContributePool,
);
export const navigateToCreatePool = createNavigate(ROUTE_NAMES.CreatePool);
export const navigateToRemovePool = createNavigate(ROUTE_NAMES.RemovePool);
export const navigateToOrderLimitDetail = createNavigate(
  ROUTE_NAMES.OrderLimitDetail,
);
export const navigateToReceipt = createNavigate(ROUTE_NAMES.Receipt);
export const navigateToFrequentReceiversForm = createNavigate(
  ROUTE_NAMES.FrequentReceiversForm,
);
export const navigateToSelectNetworkName = createNavigate(
  ROUTE_NAMES.SelectNetworkName,
);
export const navigateToRemoveLPDetail = createNavigate(
  ROUTE_NAMES.RemoveLPDetail,
);
export const navigateToWithdrawFeeLPDetail = createNavigate(
  ROUTE_NAMES.WithdrawFeeLPDetail,
);
export const navigateToSelectToken = createNavigate(
  ROUTE_NAMES.SelectTokenScreen,
);
export const navigateToSelectTokenModal = createNavigate(
  ROUTE_NAMES.SelectTokenModal,
);
export const navigateToSelectTokenTrade = createNavigate(
  ROUTE_NAMES.SelectTokenTrade,
);
export const navigateToContributeHistoryDetail = createNavigate(
  ROUTE_NAMES.ContributeHistoryDetail,
);
export const navigateToLiquidityHistories = createNavigate(
  ROUTE_NAMES.LiquidityHistories,
);
export const navigateToConvertToUnifiedToken = createNavigate(
  ROUTE_NAMES.ConvertToUnifiedToken,
);

export const navigateToConvertToUnifiedTokenInfo = createNavigate(
  ROUTE_NAMES.ConvertToUnifiedTokenInfo,
);

export const navigateToPrivacyAppsPancake = createNavigate(
  ROUTE_NAMES.PrivacyAppsPancake,
);
export const navigateToPrivacyAppsUni = createNavigate(
  ROUTE_NAMES.PrivacyAppsUni,
);
export const navigateToPrivacyAppsCurve = createNavigate(
  ROUTE_NAMES.PrivacyAppsCurve,
);
export const navigateToPrivacyAppsSpooky = createNavigate(
  ROUTE_NAMES.PrivacyAppsSpooky,
);
export const navigateToPrivacyAppsTraderJoe = createNavigate(
  ROUTE_NAMES.PrivacyAppsTraderJoe,
);
export const navigateToPrivacyAppsTrisolaris = createNavigate(
  ROUTE_NAMES.PrivacyAppsTrisolaris,
);
export const navigateToPoolsTab = createNavigate(ROUTE_NAMES.PoolsTab);




export const navigateToChart = createNavigate(ROUTE_NAMES.Chart);
export const navigateToOrderSwapDetail = createNavigate(
  ROUTE_NAMES.OrdeSwapDetail,
);
