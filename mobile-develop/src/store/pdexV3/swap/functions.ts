/* eslint-disable import/no-cycle */
import {
  ACCOUNT_CONSTANT,
  PrivacyVersion,
} from 'incognito-chain-web-js/build/wallet';
import isEmpty from 'lodash/isEmpty';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import {batch} from 'react-redux';
import {PRV, PRV_ID} from '@src/constants/common';
import format from '@src/utils/format';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash/orderBy';
import {ANALYTICS} from '@src/constants';
import {replaceCommaText} from '@utils/string';
import {
  buytokenSelector,
  feeSelectedSelector,
  feetokenDataSelector,
  inputAmountSelector,
  selltokenSelector,
  orderDetailSelector,
  swapInfoSelector,
  slippagetoleranceSelector,
  swapSelector,
  defaultPairSelector,
  sellInputTokenSelector,
  findTokenPancakeByIdSelector,
  findTokenCurveByIdSelector,
  findTokenUniByIdSelector,
  platformSelectedSelector,
  isPairSupportedTradeOnPancakeSelector,
  isPairSupportedTradeOnUniSelector,
  isPairSupportedTradeOnCurveSelector,
  defaultExchangeSelector,
  isPrivacyAppSelector,
  errorEstimateTradeSelector,
  findTokenSpookyByIdSelector,
  getExchangeSupportByPlatformId,
  findTokenJoeByIdSelector,
  findTokenTrisolarisByIdSelector,
  getEsimateCountSelector,
  swapFormErrorSelector,
  findTokenInterSwapByIdSelector,
  getPrivacyTokenListSelector,
} from './selectors';
import {
  PANCAKE_SUPPORT_NETWORK,
  UNISWAP_SUPPORT_NETWORK,
  CURVE_SUPPORT_NETWORK,
  SPOOKY_SUPPORT_NETWORK,
  ExchangeData,
  JOE_SUPPORT_NETWORK,
  TRISOLARIS_SUPPORT_NETWORK,
  ActionSaveUnifiedAlertStateByIdPayload,
} from './types';

import {
  TransactionHandler,
  CreateTransactionPAppsPayload,
  CreateTransactionPDexPayload,
} from './transactionHandler';

import {getNetworkByExchange, isSupportByPlatform} from './utils';
import {
  changeEstimateDataPdexV3,
  changeSelectedPlatformPdexV3,
  changeSlippagePdexV3,
  fetchedListPairsPdexV3,
  fetchedOrderDetailPdexV3,
  fetchedOrdersHistoryPdexV3,
  fetchedRewardHistoryPdexV3,
  fetchedSwapPdexV3,
  fetchFailOrdersHistoryPdexV3,
  fetchFailRewardHistoryPdexV3,
  fetchFailSwapPdexV3,
  fetchingOrderDetailPdexV3,
  fetchingOrdersHistoryPdexV3,
  fetchingSwapPdexV3,
  fetchSwapPdexV3,
  freeHistoryOrdersPdexV3,
  resetDataSwapPdexV3,
  resetExchangeSupportedPdexV3,
  resetSwapPdexV3,
  saveLastFieldPdexV3,
  saveUnifiedAlertStateByIdPdexV3,
  setBestRateExchangePdexV3,
  setBuyTokenPdexV3,
  setDefaultExchangePdexV3,
  setDefaultPairPdexV3,
  setEstimateCountPdexV3,
  setEstimateTradeErrorPdexV3,
  setExchangeSupportListPdexV3,
  setFeeTokenPdexV3,
  setFocusTokenPdexV3,
  setInitingSwapPdexV3,
  setNavigateFromMarketPdexV3,
  setNavigateToSelectionPdexV3,
  setPercentPdexV3,
  setResetSlippagePdexV3,
  setSelectingTokenPdexV3,
  setSellTokenPdexV3,
  setSwapingTokenPdexV3,
  toggleProTabPdexV3,
} from '.';
import getStore from '@src/store/getStore';
import {
  CALL_CONTRACT,
  ESTIMATE_COUNT_MAX,
  formConfigs,
  KEYS_PLATFORMS_SUPPORTED,
} from './constants';
import {change, reset} from 'redux-form';
import {getBalance} from '@src/store/token/functions';
import {minPRVNeededSelector} from '@src/store/refillPRV/selector';
import {getPrivacyDataByTokenID} from '@src/store/selectedPrivacy/selectors';
import {
  defaultAccountSelector,
  defaultAccountWalletSelector,
} from '@src/store/account/selectors';
import {parseShard} from '@src/screens/Account/ExportAccount/utils';
import {replaceDecimalsWithFormatPoint} from '@src/utils/convert';
import SwapService from '@src/services/api/swap';
import {
  extractEstimateData,
  isUseTokenFeeParser,
} from './estimate.helperMethods';
import {toHumanAmount} from '@src/utils/common';
import {ExHandler} from '@src/services/exception';
import {getCurrentRouteName} from '@src/services/RouteNameService';
import {actionGetPDexV3Inst} from '../functions';

export const actionEstiamteCount = payload => setEstimateCountPdexV3(payload);

export const actionResetExchangeSupported = payload =>
  resetExchangeSupportedPdexV3(payload);

export const actionNavigateFormMarketTab = payload =>
  setNavigateFromMarketPdexV3(payload);

export const actionNavigateToSelectToken = payload =>
  setNavigateToSelectionPdexV3(payload);

export const actionEstimateTradeError = payload =>
  setEstimateTradeErrorPdexV3(payload);

export const actionSetBestRateExchange = payload =>
  setBestRateExchangePdexV3(payload);

export const actionSetExchangeSupportList = payload =>
  setExchangeSupportListPdexV3(payload);

export const actionChangeSlippage = payload => changeSlippagePdexV3(payload);

export const actionSetDefaultExchange = ({isPrivacyApp, exchange}) =>
  setDefaultExchangePdexV3({isPrivacyApp, exchange});

export const actionChangeEstimateData = payload =>
  changeEstimateDataPdexV3(payload);

export const actionSaveLastField = field => saveLastFieldPdexV3(field);

export const actionToggleProTab = payload => toggleProTabPdexV3(payload);

export const actionSetPercent = payload => setPercentPdexV3(payload);

export const actionSetSellTokenFetched = payload => setSellTokenPdexV3(payload);

export const actionSetBuyTokenFetched = payload => setBuyTokenPdexV3(payload);

export const actionSetFeeToken = payload => setFeeTokenPdexV3(payload);

export const actionResetSlippage = () => setResetSlippagePdexV3();

export const actionSetFocusToken = payload => setFocusTokenPdexV3(payload);

export const actionFetching = payload => fetchingSwapPdexV3(payload);

export const actionFetched = payload => fetchedSwapPdexV3(payload);

export const actionFetchFail = () => fetchFailSwapPdexV3();

export const actionReset = () => resetSwapPdexV3();

export const actionResetData = payload => resetDataSwapPdexV3(payload);

export const actionEstimateTradeForMax = async () => {
  try {
    const state = getStore().getState();
    const feeTokenData = feetokenDataSelector(state);
    const {
      payFeeByPRV,
      minFeeOriginalPRV,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
      availableFixedSellAmountToken,
    } = feeTokenData;
    const {tokenId: selltoken, isMainCrypto: sellTokenIsPRV} =
      sellInputTokenSelector(state);
    if (sellTokenIsPRV) {
      batch(() => {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
        change(formConfigs.formName, formConfigs.feetoken, minFeePRVFixed);
      });
    } else {
      // sellTokenIsToken
      const prvBalance = await getBalance(PRV.id);
      let availableOriginalPRVAmount = new BigNumber(prvBalance).minus(
        minFeeOriginalPRV,
      );
      const canPayFeeByPRV =
        minFeeOriginalPRV && availableOriginalPRVAmount.gt(0);
      if (canPayFeeByPRV && payFeeByPRV) {
        batch(() => {
          // This is from redux-form, old code have dispatch change here
          change(
            formConfigs.formName,
            formConfigs.selltoken,
            availableFixedSellAmountPRV,
          );
          change(formConfigs.formName, formConfigs.feetoken, minFeePRVFixed);
        });
      } else {
        batch(() => {
          change(
            formConfigs.formName,
            formConfigs.selltoken,
            availableFixedSellAmountToken,
          );
          change(formConfigs.formName, formConfigs.feetoken, minFeeTokenFixed);
          actionSetFeeToken(selltoken);
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForPDex = async () => {
  try {
    const state = getStore().getState();
    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken, pDecimals: sellPDecimals} = sellInputToken;
    const {pDecimals: buyPDecimals} = buyInputToken;
    const feeTokenData = feetokenDataSelector(state);
    const {
      minFeeAmountFixed,
      canNotPayFeeByPRV,
      minFeeTokenFixed,
      payFeeByPRV,
      feePrvEst,
      feeTokenEst,
      field,
      useMax,
    } = feeTokenData;
    let maxGet = 0;
    switch (field) {
      case formConfigs.selltoken: {
        if (payFeeByPRV) {
          maxGet = feePrvEst?.maxGet || 0;
        } else {
          maxGet = feeTokenEst?.maxGet || 0;
        }
        inputPDecimals = buyPDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        if (payFeeByPRV) {
          maxGet = feePrvEst?.sellAmount || 0;
        } else {
          maxGet = feeTokenEst?.sellAmount || 0;
        }
        inputPDecimals = sellPDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');
    if (useMax) {
      await actionEstimateTradeForMax({});
    } else {
      batch(() => {
        if (canNotPayFeeByPRV) {
          batch(() => {
            actionSetFeeToken(selltoken);
            change(
              formConfigs.formName,
              formConfigs.feetoken,
              minFeeTokenFixed,
            );
          });
        } else {
          change(formConfigs.formName, formConfigs.feetoken, minFeeAmountFixed);
        }
      });
    }
  } catch (error) {
    console.log('error ', error);
    throw error;
  }
};

export const setDefaultTradingPlatformOnPdexV3 = async () => {
  const state = getStore().getState();
  const isPairSupportedTradeOnPancake =
    isPairSupportedTradeOnPancakeSelector(state);
  const isPairSupportedTradeOnUni = isPairSupportedTradeOnUniSelector(state);
  const isPairSupportedTradeOnCurve =
    isPairSupportedTradeOnCurveSelector(state);
  if (isPairSupportedTradeOnPancake) {
    actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.pancake);
  } else if (isPairSupportedTradeOnUni) {
    actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.uni);
  } else if (isPairSupportedTradeOnCurve) {
    actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.curve);
  } else {
    actionChangeSelectedPlatform(KEYS_PLATFORMS_SUPPORTED.incognito);
  }
};

export const actionHandleInjectEstDataForCurve = async () => {
  try {
    // await dispatch(actionSetFeeToken(PRV.id));
    const state = getStore().getState();
    let feeData = feetokenDataSelector(state);
    const isUseTokenFee = feeData?.curve?.isUseTokenFee;
    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken} = sellInputToken;
    const {tokenId: buytoken} = buyInputToken;
    const {field, useMax} = feetokenDataSelector(state);
    const getCurveTokenParamReq = findTokenCurveByIdSelector(state);
    const tokenSellCurve = getCurveTokenParamReq(selltoken);
    const tokenBuyCurve = getCurveTokenParamReq(buytoken);
    if (tokenSellCurve == null || tokenBuyCurve == null) {
      throw 'This pair is not existed on curve';
    }

    if (isUseTokenFee) {
      await actionSetFeeToken(selltoken);
    } else {
      await actionSetFeeToken(PRV.id);
    }

    switch (field) {
      case formConfigs.selltoken: {
        inputPDecimals = tokenBuyCurve.pDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        inputPDecimals = tokenSellCurve.pDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    const {
      maxGet,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
    } = feetokenDataSelector(state);
    batch(() => {
      if (useMax) {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
      }
      change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');

      change(
        formConfigs.formName,
        formConfigs.feetoken,
        isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
      );
    });
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForUni = async () => {
  try {
    // await dispatch(actionSetFeeToken(PRV.id));
    const state = getStore().getState();
    let feeData = feetokenDataSelector(state);
    let isUseTokenFee;
    if (platformId === KEYS_PLATFORMS_SUPPORTED.uni) {
      isUseTokenFee = feeData?.uni?.isUseTokenFee;
    } else if (platformId === KEYS_PLATFORMS_SUPPORTED.uniEther) {
      isUseTokenFee = feeData?.uniEther?.isUseTokenFee;
    }

    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken} = sellInputToken;
    const {tokenId: buytoken} = buyInputToken;
    const {field, useMax} = feeData;
    const getUniTokenParamReq = findTokenUniByIdSelector(state);
    const tokenSellUni = getUniTokenParamReq(selltoken);
    const tokenBuyUni = getUniTokenParamReq(buytoken);

    if (tokenSellUni == null || tokenBuyUni == null) {
      throw 'This pair is not existed on uni';
    }
    if (isUseTokenFee) {
      await actionSetFeeToken(selltoken);
    } else {
      await actionSetFeeToken(PRV.id);
    }
    switch (field) {
      case formConfigs.selltoken: {
        inputPDecimals = tokenBuyUni.pDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        inputPDecimals = tokenSellUni.pDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    const {
      maxGet,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
    } = feetokenDataSelector(state);
    batch(() => {
      if (useMax) {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
      }
      change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');
      change(
        formConfigs.formName,
        formConfigs.feetoken,
        isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
      );
    });
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForPancake = async () => {
  try {
    const state = getStore().getState();
    let feeData = feetokenDataSelector(state);
    const isUseTokenFee = feeData?.pancake?.isUseTokenFee;
    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken} = sellInputToken;
    const {tokenId: buytoken} = buyInputToken;
    if (isUseTokenFee) {
      await actionSetFeeToken(selltoken);
    } else {
      await actionSetFeeToken(PRV.id);
    }
    const {field, useMax} = feeData;
    const getPancakeTokenParamReq = findTokenPancakeByIdSelector(state);
    const tokenSellPancake = getPancakeTokenParamReq(selltoken);
    const tokenBuyPancake = getPancakeTokenParamReq(buytoken);
    if (tokenSellPancake == null || tokenBuyPancake == null) {
      throw 'This pair is not existed on pancake';
    }
    switch (field) {
      case formConfigs.selltoken: {
        inputPDecimals = tokenBuyPancake.pDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        inputPDecimals = tokenSellPancake.pDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    const {
      maxGet,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
    } = feetokenDataSelector(state);
    batch(() => {
      if (useMax) {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
      }
      change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');
      change(
        formConfigs.formName,
        formConfigs.feetoken,
        isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
      );
    });
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForSpooky = async () => {
  try {
    const state = getStore().getState();
    let feeData = feetokenDataSelector(state);
    const isUseTokenFee = feeData?.spooky?.isUseTokenFee;
    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken} = sellInputToken;
    const {tokenId: buytoken} = buyInputToken;
    if (isUseTokenFee) {
      await actionSetFeeToken(selltoken);
    } else {
      await actionSetFeeToken(PRV.id);
    }
    const {field, useMax} = feeData;
    const getSpookyTokenParamReq = findTokenSpookyByIdSelector(state);
    const tokenSellSpooky = getSpookyTokenParamReq(selltoken);
    const tokenBuySpooky = getSpookyTokenParamReq(buytoken);
    if (tokenSellSpooky == null || tokenBuySpooky == null) {
      throw 'This pair is not existed  on spooky';
    }
    switch (field) {
      case formConfigs.selltoken: {
        inputPDecimals = tokenBuySpooky.pDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        inputPDecimals = tokenSellSpooky.pDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    const {
      maxGet,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
    } = feetokenDataSelector(state);

    batch(() => {
      if (useMax) {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
      }
      change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');
      change(
        formConfigs.formName,
        formConfigs.feetoken,
        isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
      );
    });
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForJoe = async () => {
  try {
    const state = getStore().getState();
    let feeData = feetokenDataSelector(state);
    const isUseTokenFee = feeData?.joe?.isUseTokenFee;
    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken} = sellInputToken;
    const {tokenId: buytoken} = buyInputToken;
    if (isUseTokenFee) {
      await actionSetFeeToken(selltoken);
    } else {
      await actionSetFeeToken(PRV.id);
    }
    const {field, useMax} = feeData;
    const getJoeTokenParamReq = findTokenJoeByIdSelector(state);
    const tokenSellJoe = getJoeTokenParamReq(selltoken);
    const tokenBuyJoe = getJoeTokenParamReq(buytoken);
    if (tokenSellJoe == null || tokenBuyJoe == null) {
      throw 'This pair is not existed  on joe';
    }
    switch (field) {
      case formConfigs.selltoken: {
        inputPDecimals = tokenBuyJoe.pDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        inputPDecimals = tokenSellJoe.pDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    const {
      maxGet,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
    } = feetokenDataSelector(state);

    batch(() => {
      if (useMax) {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
      }
      change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');
      change(
        formConfigs.formName,
        formConfigs.feetoken,
        isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
      );
    });
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForTrisolaris = async () => {
  try {
    const state = getStore().getState();
    let feeData = feetokenDataSelector(state);
    const isUseTokenFee = feeData?.trisolaris?.isUseTokenFee;
    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken} = sellInputToken;
    const {tokenId: buytoken} = buyInputToken;
    if (isUseTokenFee) {
      await actionSetFeeToken(selltoken);
    } else {
      await actionSetFeeToken(PRV.id);
    }
    const {field, useMax} = feeData;
    const getTrisolarisTokenParamReq = findTokenTrisolarisByIdSelector(state);
    const tokenSellTrisolaris = getTrisolarisTokenParamReq(selltoken);
    const tokenBuyTrisolaris = getTrisolarisTokenParamReq(buytoken);
    if (tokenSellTrisolaris == null || tokenBuyTrisolaris == null) {
      throw 'This pair is not existed  on Trisolaris';
    }
    switch (field) {
      case formConfigs.selltoken: {
        inputPDecimals = tokenBuyTrisolaris.pDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        inputPDecimals = tokenSellTrisolaris.pDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    const {
      maxGet,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
    } = feetokenDataSelector(state);

    batch(() => {
      if (useMax) {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
      }
      change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');
      change(
        formConfigs.formName,
        formConfigs.feetoken,
        isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
      );
    });
  } catch (error) {
    throw error;
  }
};

export const actionHandleInjectEstDataForInterswap = async () => {
  try {
    const state = getStore().getState();
    let feeData = feetokenDataSelector(state);
    const isUseTokenFee = feeData?.interswap?.isUseTokenFee;
    const inputAmount = inputAmountSelector(state);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);
    const {tokenId: selltoken} = sellInputToken;
    const {tokenId: buytoken} = buyInputToken;
    if (isUseTokenFee) {
      await actionSetFeeToken(selltoken);
    } else {
      await actionSetFeeToken(PRV.id);
    }
    const {field, useMax} = feeData;
    const getInterSwapTokenParamReq = findTokenInterSwapByIdSelector(state);
    const tokenSellInterSwap = getInterSwapTokenParamReq(selltoken);
    const tokenBuyInterSwap = getInterSwapTokenParamReq(buytoken);

    if (tokenSellInterSwap == null || tokenBuyInterSwap == null) {
      throw 'This pair is not existed  on Interswap';
    }
    switch (field) {
      case formConfigs.selltoken: {
        inputPDecimals = tokenBuyInterSwap.pDecimals;
        inputToken = formConfigs.buytoken;
        break;
      }
      case formConfigs.buytoken: {
        inputPDecimals = tokenSellInterSwap.pDecimals;
        inputToken = formConfigs.selltoken;
        break;
      }
      default:
        break;
    }
    const {
      maxGet,
      minFeePRVFixed,
      availableFixedSellAmountPRV,
      minFeeTokenFixed,
    } = feetokenDataSelector(state);

    batch(() => {
      if (useMax) {
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          availableFixedSellAmountPRV,
        );
      }
      change(formConfigs.formName, inputToken, maxGet ? maxGet.toString() : '');
      change(
        formConfigs.formName,
        formConfigs.feetoken,
        isUseTokenFee ? minFeeTokenFixed : minFeePRVFixed,
      );
    });
  } catch (error) {
    throw error;
  }
};

export const actionEstimateTrade =
  ({field = formConfigs.selltoken, useMax = false} = {}) =>
  async () => {
    const state = getStore().getState();

    const inputAmount = inputAmountSelector(state);
    const estimateCount = getEsimateCountSelector(state);
    const formErrors = swapFormErrorSelector(state);
    const {networkfee} = swapInfoSelector(state);
    const minPRVNeeded = minPRVNeededSelector(state);

    let feeData = feetokenDataSelector(state);
    const prvData: SelectedPrivacy = getPrivacyDataByTokenID(state)(PRV.id);
    const account = defaultAccountSelector(state);

    const shardID = parseShard(account?.PublicKeyBytes);
    let sellInputToken, buyInputToken, inputToken, inputPDecimals;
    sellInputToken = inputAmount(formConfigs.selltoken);
    buyInputToken = inputAmount(formConfigs.buytoken);

    const defaultExchange = defaultExchangeSelector(state);

    if (
      formErrors &&
      (formErrors[formConfigs.selltoken] === 'Must be a number' ||
        formErrors[formConfigs.selltoken] === 'Required')
    ) {
      return;
    }

    if (isEmpty(sellInputToken) || isEmpty(buyInputToken)) {
      return;
    }
    try {
      const params = {field, useMax};
      // Show loading estimate trade and reset fee data
      actionFetching(true);
      actionEstimateTradeError(null);

      const {
        tokenId: sellTokenId,
        originalAmount: sellOriginalAmount,
        pDecimals: sellPDecimals,
        availableOriginalAmount: availableSellOriginalAmount,
        amount: sellAmountEx,
      } = sellInputToken;

      const {tokenId: buyTokenId, symbol: buyInputSymbol} = buyInputToken;

      let maxAmount = availableSellOriginalAmount;

      if (useMax) {
        const {maxAmount: _maxAmount} = await actionGetMaxAmount();
        maxAmount = format.amountFull(_maxAmount, sellPDecimals, false);
      }

      // let sellAmount = useMax ? maxAmount : sellOriginalAmount;
      let sellAmount = useMax ? maxAmount : sellAmountEx;
      let sellAmountStr;
      if (typeof sellAmount === 'string') {
        sellAmountStr = replaceDecimalsWithFormatPoint(String(sellAmount));
      }

      if (typeof sellAmount === 'number') {
        sellAmountStr = replaceDecimalsWithFormatPoint(
          new BigNumber(sellAmount).toString(),
        );
      }

      // console.log('sellAmountStr ', sellAmountStr);
      const slippagetolerance = slippagetoleranceSelector(state);

      await actionChangeEstimateData({field, useMax});

      let network = getNetworkByExchange(defaultExchange);
      let estimateRawData;
      try {
        estimateRawData = await SwapService.getEstimateTradingFee({
          amount: sellAmountStr,
          fromToken: sellTokenId,
          toToken: buyTokenId,
          slippage: slippagetolerance.toString(),
          network: network,
          shardID: `${shardID}`,
        });
      } catch (error) {
        // console.log('=> getEstimateTradingFee! error ', {
        //   error,
        // });
        actionEstimateTradeError(
          error.message || error || 'No tradeable network found',
        );
        return;
      } finally {
        if (!estimateRawData) {
          // eslint-disable-next-line no-unsafe-finally
          return;
        }
      }

      //NEW FLOW, combine all esimate fee API in one with new Back-End (from Lam)

      const {bestRateExchange, exchangeSupports} = await extractEstimateData(
        estimateRawData,
        sellInputToken.tokenData,
        defaultExchange,
      );
      // console.log('buyInputToken ', buyInputToken);
      // console.log('payload ', payload);

      if (useMax && estimateCount < ESTIMATE_COUNT_MAX) {
        checkReEstimate(
          bestRateExchange,
          feeData,
          sellInputToken,
          buyInputToken,
          prvData,
          networkfee,
          minPRVNeeded,
        );
        return;
      }
      let job = [];
      exchangeSupports.map(async exchange => {
        const {
          amountOut,
          feeAddress,
          fees,
          routes,
          impactAmount,
          incTokenID,
          platformNameSupported,
          amountOutPreSlippage,
          rate,
          rateStr,
          amountOutStr,
          interSwapData,
        } = exchange;
        const [isUseTokenFee, originalTradeFee] = isUseTokenFeeParser(fees);
        const platformData = {
          feePrv: {
            fee: isUseTokenFee ? 0 : originalTradeFee,
            isSignificant: false,
            maxGet: format.numberWithNoGroupSeparator(amountOutPreSlippage, 0),
            route: routes,
            sellAmount: sellAmountStr,
            buyAmount: amountOut,
            impactAmount: format.amount(impactAmount, 0),
            tokenRoute: interSwapData?.path || routes,
            rateValue: format.amount(rateStr, 0),
            interSwapData,
          },
          feeToken: {
            sellAmount: sellAmountStr,
            buyAmount: amountOut,
            fee: isUseTokenFee ? originalTradeFee : 0,
            isSignificant: false,
            maxGet: format.numberWithNoGroupSeparator(amountOutPreSlippage, 0),
            route: routes,
            impactAmount: format.amount(impactAmount, 0),
            tokenRoute: interSwapData?.path || routes,
            rateValue: format.amount(rateStr, 0),
            interSwapData,
          },
          rateValue: format.amountVer2(rateStr, 0),
          tradeID: '',
          feeAddress,
          signAddress: '',
          unifiedTokenId: sellTokenId,
          tokenId: incTokenID,
          isUseTokenFee,
          error: null,
          minimumReceived: amountOutStr
            ? `${format.amountVer2(amountOutStr, 0)} ${buyInputSymbol}`
            : undefined,
        };

        // console.log('------------------------------');
        // console.log('platformData ', platformData);
        // console.log('platformNameSupported ', platformNameSupported);
        // console.log('exchange ', exchange);

        switch (platformNameSupported) {
          case 'pancake':
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.pancake]: platformData,
                }),
              );
            }
            break;
          case 'uni':
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.uni]: platformData,
                }),
              );
            }
            break;

          case 'uniEther':
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.uniEther]: platformData,
                }),
              );
            }
            break;
          case 'curve':
            actionChangeEstimateData({
              [KEYS_PLATFORMS_SUPPORTED.curve]: platformData,
            });
            break;
          case 'spooky':
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.spooky]: platformData,
                }),
              );
            }
            break;
          case 'joe':
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.joe]: platformData,
                }),
              );
            }
            break;
          case 'trisolaris':
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.trisolaris]: platformData,
                }),
              );
            }
            break;
          case 'interswap':
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.interswap]: platformData,
                }),
              );
            }
            break;
          default:
            {
              job.push(
                actionChangeEstimateData({
                  [KEYS_PLATFORMS_SUPPORTED.incognito]: platformData,
                }),
              );
            }
            break;
        }
      });

      await Promise.all(job);

      console.log('Estimate process DONE');

      await actionSetBestRateExchange(bestRateExchange);
      await actionSetExchangeSupportList(exchangeSupports);
      await actionEstiamteCount(1);
      await actionSwitchPlatform(bestRateExchange.platformNameSupported);

      state = getStore().getState();
      const {availableAmountText, availableOriginalAmount} =
        sellInputTokenSelector(state);

      const errorEstTrade = errorEstimateTradeSelector(state);

      if (errorEstTrade) {
        new ExHandler(errorEstTrade).showErrorToast();
        if (useMax && availableOriginalAmount) {
          change(
            formConfigs.formName,
            formConfigs.selltoken,
            availableAmountText,
          );
        }
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      actionSetFocusToken('');
      actionFetched({isFetched: true});
    }
  };

const checkReEstimate = async (
  bestRateExchange: ExchangeData,
  feeData,
  sellInputToken,
  buyInputToken,
  prvData,
  networkfee = 0,
  minPRVNeeded = 0,
) => {
  try {
    const sellAmount =
      sellInputToken?.originalAmount || sellInputToken?.availableOriginalAmount;
    const sellTokenIsPRV = sellInputToken?.tokenId === PRV.id;
    const payFeeByPRV = bestRateExchange?.fees[0].tokenid === PRV.id;
    const feeAmount = bestRateExchange?.fees[0].amount;
    const prvBalanceAmount = prvData?.amount || 0;

    const prvBalanceObj = new BigNumber(prvBalanceAmount);

    if (sellTokenIsPRV) {
      if (payFeeByPRV) {
        console.log('RE ESTIMATE CASE 1 ====>>> ');
        // CASE 1:
        // SellToken: PRV
        // Fee: PRV

        let bufferFee = 0;

        if (prvBalanceObj.gt(2 * minPRVNeeded)) {
          bufferFee = minPRVNeeded;
        } else {
          bufferFee = 0;
        }

        const totalFee = feeAmount + networkfee + bufferFee;
        // console.log('feeAmount ', feeAmount);
        // console.log('networkfee ', networkfee);
        // console.log('totalFee ', totalFee);

        const sellAmountAndFeePRVTotal = new BigNumber(sellAmount).plus(
          totalFee,
        );
        if (sellAmountAndFeePRVTotal.gt(prvBalanceObj)) {
          const newPRVInputAmountNumber = prvBalanceObj.minus(totalFee);

          if (newPRVInputAmountNumber.lt(0)) {
            //Option 1: don't est
            // await dispatch(actionEstiamteCount());
            // return;

            //Option 2:
            //Still est with old value

            await actionEstiamteCount();
            actionEstimateTrade();
            return;
          }

          const newPRVInputAmount = toHumanAmount(
            newPRVInputAmountNumber,
            prvData.pDecimals || prvData.decimals,
          );
          const newPRVInputAmountToFixed = format.toFixed(
            newPRVInputAmount,
            prvData.pDecimals || prvData.decimals,
          );
          await actionEstiamteCount();
          change(
            formConfigs.formName,
            formConfigs.selltoken,
            newPRVInputAmountToFixed,
          );
          actionEstimateTrade();
        }
      } else {
        // console.log('RE ESTIMATE CASE 2 ====>>> ');
        // CASE 2:
        // SellToken: PRV
        // Fee: Token
      }
    } else {
      if (!payFeeByPRV) {
        console.log('RE ESTIMATE CASE 3 ====>>> ');
        // CASE 3:
        // SellToken: A Token
        // Fee: A Token

        // console.log('RE ESTIMATE CASE 3 sellAmount ====>>> ', sellAmount);
        // console.log('RE ESTIMATE CASE 3 feeAmount ====>>> ', feeAmount);

        let newInputAmount;
        if (new BigNumber(sellAmount).minus(feeAmount).lt(0)) {
          // console.log('newInputAmount = FeeAmount ');

          newInputAmount = toHumanAmount(
            new BigNumber(feeAmount),
            sellInputToken.pDecimals,
          );
        } else {
          // console.log('newInputAmount = sellAmount -  feeAmount');

          newInputAmount = toHumanAmount(
            new BigNumber(sellAmount).minus(feeAmount),
            sellInputToken.pDecimals,
          );
        }
        const newInputAmountToFixed = format.toFixed(
          newInputAmount,
          sellInputToken.pDecimals,
        );
        await actionEstiamteCount();
        change(
          formConfigs.formName,
          formConfigs.selltoken,
          newInputAmountToFixed,
        );
        actionEstimateTrade();
      } else {
        // console.log('RE ESTIMATE CASE 4 ====>>> ');
        // CASE 4:
        // SellToken: A Token
        // Fee: PRV Token
      }
    }
  } catch (error) {
    console.log('ERROR: ', error);
  }
};

export const actionInitingSwapForm = payload => setInitingSwapPdexV3(payload);

export const actionFetchedPairs = payload => fetchedListPairsPdexV3(payload);

export const actionFetchPairs = async refresh => {
  let pairs = [];

  let pancakeTokens = [];
  let uniTokens = [];
  let curveTokens = [];
  let spookyTokens = [];
  let joeTokens = [];
  let trisolarisTokens = [];
  let interswapTokens = [];

  try {
    const state = getStore().getState();
    const {pairs: tokenIdList} = swapSelector(state);

    const privacyTokenList = getPrivacyTokenListSelector(state);

    if (!refresh && tokenIdList.length > 0) {
      return tokenIdList;
    }
    const defaultExchange = defaultExchangeSelector(state);
    const isPrivacyApp = isPrivacyAppSelector(state);

    privacyTokenList.map((token: SelectedPrivacy) => {
      pairs.push(token.tokenId);
      // interswap get all tokens
      interswapTokens.push(token);

      if (isSupportByPlatform(PANCAKE_SUPPORT_NETWORK, token)) {
        pancakeTokens.push(token);
      }
      if (isSupportByPlatform(UNISWAP_SUPPORT_NETWORK, token)) {
        uniTokens.push(token);
      }
      if (isSupportByPlatform(CURVE_SUPPORT_NETWORK, token)) {
        curveTokens.push(token);
      }
      if (isSupportByPlatform(SPOOKY_SUPPORT_NETWORK, token)) {
        spookyTokens.push(token);
      }
      if (isSupportByPlatform(JOE_SUPPORT_NETWORK, token)) {
        joeTokens.push(token);
      }
      if (isSupportByPlatform(TRISOLARIS_SUPPORT_NETWORK, token)) {
        trisolarisTokens.push(token);
      }
    });

    if (isPrivacyApp) {
      switch (defaultExchange) {
        case KEYS_PLATFORMS_SUPPORTED.pancake:
          pairs = pancakeTokens.map(token => token.tokenId);
          break;

        case KEYS_PLATFORMS_SUPPORTED.uni:
        case KEYS_PLATFORMS_SUPPORTED.uniEther:
          pairs = uniTokens.map(token => token.tokenId);
          break;

        case KEYS_PLATFORMS_SUPPORTED.curve:
          pairs = curveTokens.map(token => token.tokenId);
          break;

        case KEYS_PLATFORMS_SUPPORTED.spooky:
          pairs = spookyTokens.map(token => token.tokenId);
          break;

        case KEYS_PLATFORMS_SUPPORTED.joe:
          pairs = joeTokens.map(token => token.tokenId);
          break;

        case KEYS_PLATFORMS_SUPPORTED.trisolaris:
          pairs = trisolarisTokens.map(token => token.tokenId);
          break;
        case KEYS_PLATFORMS_SUPPORTED.interswap:
          pairs = interswapTokens.map(token => token.tokenId);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  }

  actionFetchedPairs({
    pairs,
    pancakeTokens,
    uniTokens,
    curveTokens,
    spookyTokens,
    joeTokens,
    trisolarisTokens,
    interswapTokens,
  });
  return pairs;
};

export const actionFreeHistoryOrders = () => freeHistoryOrdersPdexV3();

export const actionInitSwapForm = async ({
  refresh = true,
  defaultPair = {},
  shouldFetchHistory = false,
} = {}) => {
  try {
    let state = getStore().getState();
    const feetoken = feeSelectedSelector(state);
    const defaultExchange = defaultExchangeSelector(state);
    const {slippage: defautSlippage, resetSlippage1} = swapSelector(state);
    const isUsePRVToPayFee = feetoken === PRV.id;
    let pair = defaultPair || defaultPairSelector(state);

    batch(() => {
      actionInitingSwapForm(true);
      // reset of redux form, maybe need wrap with dispatch
      reset(formConfigs.formName);
      actionResetData();
      change(formConfigs.formName, formConfigs.feetoken, '');
      actionSetSellTokenFetched(pair?.selltoken);
      actionSetBuyTokenFetched(pair?.buytoken);
      actionEstimateTradeError(undefined); //Clear Estimate Trade Error
      actionResetExchangeSupported(); //Reset Exchange Supported
      if (refresh && shouldFetchHistory) {
        actionFreeHistoryOrders();
      }
    });

    const pairs = await actionFetchPairs(false);
    const {selltoken} = pair;
    state = getStore().getState();
    let _defautSlippage = replaceCommaText({text: defautSlippage});
    if (!resetSlippage1) {
      _defautSlippage = format.amountFull('0.5', 0);
      actionResetSlippage();
    }
    batch(() => {
      change(
        formConfigs.formName,
        formConfigs.slippagetolerance,
        _defautSlippage,
      );
      // const useFeeByToken = selltoken !== PRV_ID && !isUsePRVToPayFee;
      // if (useFeeByToken) {
      //   dispatch(actionSetFeeToken(selltoken));
      // } else {
      //   dispatch(actionSetFeeToken(PRV.id));
      // }
      getBalance(selltoken);
      if (selltoken !== PRV_ID && refresh) {
        getBalance(PRV_ID);
      }
      if (shouldFetchHistory) {
        actionFetchHistory();
      }
    });
    // const currentScreen = currentScreenSelector(state);
    // if (currentScreen === routeNames.Trade) {
    //   dispatch(setDefaultTradingPlatformOnPdexV3());
    // } else {
    //   dispatch(actionChangeSelectedPlatform(defaultExchange));
    // }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    actionInitingSwapForm(false);
  }
};

export const actionSetSwapingToken = payload => setSwapingTokenPdexV3(payload);

export const actionSwapToken = async () => {
  try {
    const state = getStore().getState();
    const {tokenId: selltoken}: SelectedPrivacy = selltokenSelector(state);
    const {tokenId: buytoken}: SelectedPrivacy = buytokenSelector(state);
    if (!selltoken | !buytoken) {
      return;
    }
    await actionSetSwapingToken(true);
    await actionInitSwapForm({
      defaultPair: {
        selltoken: buytoken,
        buytoken: selltoken,
      },
      refresh: false,
    });
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await actionSetSwapingToken(false);
  }
};

export const actionSetSelectingToken = payload =>
  setSelectingTokenPdexV3(payload);

export const actionSelectToken = async (token: SelectedPrivacy, field) => {
  if (!token.tokenId || !field) {
    return;
  }
  try {
    await actionSetSelectingToken(true);
    const state = getStore().getState();
    const selltoken: SelectedPrivacy = selltokenSelector(state);
    const buytoken: SelectedPrivacy = buytokenSelector(state);
    switch (field) {
      case formConfigs.selltoken: {
        if (selltoken.tokenId === token.tokenId) {
          return;
        }
        if (buytoken.tokenId === token.tokenId) {
          await actionSwapToken();
        } else {
          await actionInitSwapForm({
            refresh: true,
            defaultPair: {
              selltoken: token.tokenId,
              buytoken: buytoken.tokenId,
            },
          });
        }
        break;
      }
      case formConfigs.buytoken: {
        if (buytoken.tokenId === token.tokenId) {
          return;
        }
        if (selltoken.tokenId === token.tokenId) {
          await actionSwapToken();
        } else {
          await actionInitSwapForm({
            refresh: true,
            defaultPair: {
              selltoken: selltoken.tokenId,
              buytoken: token.tokenId,
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
  } finally {
    await actionSetSelectingToken(false);
  }
};

export const actionFetchingSwap = payload => fetchSwapPdexV3(payload);

export const actionFetchSwap = async () => {
  let tx;
  const state = getStore().getState();
  try {
    const {disabledBtnSwap} = swapInfoSelector(state);
    if (disabledBtnSwap) {
      return;
    }
    setTimeout(() => {
      let analytic = '';
      let params = {
        sell_token: tokenIDToSell,
        buy_token: tokenIDToBuy,
        sell_amount: String(sellAmount),
      };
      switch (platform.id) {
        case KEYS_PLATFORMS_SUPPORTED.incognito:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE;
          break;
        case KEYS_PLATFORMS_SUPPORTED.pancake:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_PANCAKE;
          break;
        case KEYS_PLATFORMS_SUPPORTED.uni:
        case KEYS_PLATFORMS_SUPPORTED.uniEther:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_UNISWAP;
          break;
        case KEYS_PLATFORMS_SUPPORTED.curve:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_CURVE;
          break;
        case KEYS_PLATFORMS_SUPPORTED.spooky:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_SPOOKY;
          break;
        case KEYS_PLATFORMS_SUPPORTED.joe:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_JOE;
          break;
        case KEYS_PLATFORMS_SUPPORTED.trisolaris:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.TRADE_TRISOLARIS;
          break;
        case KEYS_PLATFORMS_SUPPORTED.interswap:
          analytic = ANALYTICS.ANALYTIC_DATA_TYPE.INTER_SWAP;
          break;
      }
      //TODO: DO LATER
      // requestUpdateMetrics(analytic, params)
    }, 300);
    await actionFetchingSwap(true);
    const account = defaultAccountWalletSelector(state);
    const sellInputAmount = inputAmountSelector(state)(formConfigs.selltoken);
    const buyInputAmount = inputAmountSelector(state)(formConfigs.buytoken);
    const feetokenData = feetokenDataSelector(state);
    if (!sellInputAmount || !buyInputAmount || !feetokenData) {
      return;
    }
    const {
      tokenId: tokenIDToSell,
      originalAmount: sellAmount,
      amountText: sellAmountText,
    } = sellInputAmount;
    const {
      tokenId: tokenIDToBuy,
      tokenData: tokenBuyData,
      amountText: buyAmountText,
    } = buyInputAmount;
    const {origininalFeeAmount: tradingFee, feetoken} = feetokenData;
    const pDexV3Inst = await getPDexV3Instance({account});
    const platform = platformSelectedSelector(state);
    const exchangeData: ExchangeData = getExchangeSupportByPlatformId(state)(
      platform.id,
    );
    console.log('PlatformId: => ' + platform.id);
    const _sellAmountText = convert
      .toNumber(sellAmountText || 0, true)
      .toString();
    const _buyAmountText = convert
      .toNumber(buyAmountText || 0, true)
      .toString();

    switch (platform.id) {
      case KEYS_PLATFORMS_SUPPORTED.interswap: {
        const interSwapData = exchangeData?.interSwapData;
        if (!interSwapData || !interSwapData.midToken)
          throw 'Can not create transaction empty data';
        const slippage = slippagetoleranceSelector(state);
        const {midToken, midOTA, pAppNetwork, pAppName} = interSwapData;
        const payloadSubmitInterTx = {
          midOTA,
          sellTokenID: tokenIDToSell,
          buyTokenID: tokenIDToBuy,
          midToken: midToken,
          amountOutRaw: exchangeData?.amountOutRaw,
          slippage: `${slippage || 0}`,
          pAppNetwork,
          pAppName,
          inputAddress: '',
          feeAddressShardID: exchangeData?.feeAddressShardID,
        };
        // create pdex tx
        if (interSwapData.fistBatchIsPDex) {
          const params: CreateTransactionPDexPayload = {
            transfer: {fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX, info: ''},
            extra: {
              tokenIDToSell,
              sellAmount: String(sellAmount),
              tokenIDToBuy: interSwapData.midToken,
              tradingFee,
              tradePath: exchangeData?.poolPairs || [''],
              feetoken,
              version: PrivacyVersion.ver2,
              minAcceptableAmount: `${new BigNumber(
                interSwapData.pdexMinAcceptableAmount || 0,
              ).integerValue()}`,
              sellAmountText: _sellAmountText,
              buyAmountText: _buyAmountText,
              interSwapData: payloadSubmitInterTx,
            },
          };
          tx = await TransactionHandler.createTransactionPDex({
            pDexV3Instance: pDexV3Inst || {},
            params,
          });
        } else {
          const midTokenData = getPrivacyDataByTokenID(state)(
            interSwapData?.midToken,
          );
          const midChildToken = midTokenData?.isPUnifiedToken
            ? midTokenData.listUnifiedToken.find(
                token => token.networkId === exchangeData.networkID,
              )
            : midTokenData;
          const createTransactionPAppsPayload: CreateTransactionPAppsPayload = {
            pDexV3Instance: pDexV3Inst || {},
            sellTokenID: tokenIDToSell || '',
            senderFeeAddressShardID: exchangeData.feeAddressShardID | 0,
            feeReceiverAddress: exchangeData.feeAddress || '',
            feeTokenID: exchangeData.fees[0]?.tokenid || '',
            feeAmount: exchangeData.fees[0]?.amount?.toString() || '',
            sellAmount: sellAmount.toString() || '',
            callContract: exchangeData.callContract || '',
            callData: exchangeData.callData || '',
            exchangeNetworkID: exchangeData.networkID || 0,
            sellChildTokenID: exchangeData.incTokenID || '',
            buyContractID: midChildToken?.contractId || '',
            buyTokenID: tokenIDToBuy,
            sellAmountText: _sellAmountText,
            buyAmountText: _buyAmountText,
            interSwapData: payloadSubmitInterTx,
          };
          tx = await TransactionHandler.createTransactionPApps(
            createTransactionPAppsPayload,
          );
        }
        break;
      }
      case KEYS_PLATFORMS_SUPPORTED.incognito:
        {
          const params: CreateTransactionPDexPayload = {
            transfer: {fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX, info: ''},
            extra: {
              tokenIDToSell,
              sellAmount: String(sellAmount),
              tokenIDToBuy,
              tradingFee,
              tradePath: exchangeData?.poolPairs || [''],
              feetoken,
              version: PrivacyVersion.ver2,
              minAcceptableAmount: `${new BigNumber(
                exchangeData.amountOutRaw || 0,
              ).integerValue()}`,
              sellAmountText: _sellAmountText,
              buyAmountText: _buyAmountText,
            },
          };
          // tx = await pDexV3Inst.createAndSendSwapRequestTx(params);
          // if (!tx) {
          //   console.log('error');
          // }
          // console.log('sellInputAmount: => ', sellInputAmount);
          // console.log('buyInputAmount: => ', buyInputAmount);
          // console.log(
          //   '[pDex]: RepareData create TX: ',
          //   tokenBuyData,
          //   exchangeData,
          // );
          tx = await TransactionHandler.createTransactionPDex({
            pDexV3Instance: pDexV3Inst || {},
            params,
          });

          try {
            await SwapService.dexSwapMonitor({
              txhash: tx.hash,
              token_sell: sellInputAmount.tokenId,
              token_buy: buyInputAmount.tokenId,
              amount_in: sellInputAmount.amountText,
              amount_out: buyInputAmount.amountText,
            });
          } catch (error) {
            console.log('dexSwapMonitor error ', error);
          } finally {
            console.log('BY PASS dexSwapMonitor');
          }
        }
        break;
      case KEYS_PLATFORMS_SUPPORTED.pancake:
      case KEYS_PLATFORMS_SUPPORTED.uni:
      case KEYS_PLATFORMS_SUPPORTED.uniEther:
      case KEYS_PLATFORMS_SUPPORTED.curve:
      case KEYS_PLATFORMS_SUPPORTED.spooky:
      case KEYS_PLATFORMS_SUPPORTED.joe:
      case KEYS_PLATFORMS_SUPPORTED.trisolaris:
        {
          console.log(
            `[pApps - ${platform.id}]: Repair Data create TX: `,
            tokenBuyData,
            exchangeData,
          );

          const createTransactionPAppsPayload: CreateTransactionPAppsPayload = {
            pDexV3Instance: pDexV3Inst || {},
            sellTokenID: tokenIDToSell || '',
            senderFeeAddressShardID: exchangeData.feeAddressShardID | 0,
            feeReceiverAddress: exchangeData.feeAddress || '',
            feeTokenID: exchangeData.fees[0]?.tokenid || '',
            feeAmount: exchangeData.fees[0]?.amount?.toString() || '',
            sellAmount: sellAmount.toString() || '',
            callContract: exchangeData.callContract || '',
            callData: exchangeData.callData || '',
            exchangeNetworkID: exchangeData.networkID || 0,
            sellChildTokenID: exchangeData.incTokenID || '',
            buyContractID: !tokenBuyData.isPUnifiedToken
              ? tokenBuyData.contractId
              : tokenBuyData.listUnifiedToken.filter(
                  token => token.networkId === exchangeData.networkID,
                )[0]?.contractId || '',
            buyTokenID: tokenIDToBuy,
            sellAmountText: _sellAmountText,
            buyAmountText: _buyAmountText,
            // buyTokenID: !tokenBuyData.isPUnifiedToken
            //   ? tokenBuyData.tokenId
            //   : tokenBuyData.listUnifiedToken.filter(
            //       (token) => token.networkId === exchangeData.networkID,
            //     )[0]?.tokenId || '',
          };

          tx = await TransactionHandler.createTransactionPApps(
            createTransactionPAppsPayload,
          );
        }
        break;
      default:
        break;
    }
  } catch (error) {
    throw error;
  } finally {
    batch(() => {
      actionFetchingSwap(false);
      actionFetchHistory();
      // if (currentScreen !== routeNames.Trade) {
      //   dispatch(actionFetchRewardHistories());
      // }
      // Reset data after swap
      actionResetData();
      change(formConfigs.formName, formConfigs.feetoken, '');
    });
  }
  return tx;
};

export const actionFetchingOrdersHistory = () => fetchingOrdersHistoryPdexV3();

export const actionFetchedOrdersHistory = payload =>
  fetchedOrdersHistoryPdexV3(payload);

export const actionFetchFailOrderHistory = () => fetchFailOrdersHistoryPdexV3();

export const actionFetchHistory = async () => {
  let history = [];
  try {
    await actionFetchingOrdersHistory();
    const state = getStore().getState();
    const pDexV3 = await actionGetPDexV3Inst();
    // get trading platform incognito | pancake | uni | curve
    const defaultExchange = defaultExchangeSelector(state);
    // const isPrivacyApp = isPrivacyAppSelector(state);
    let callContracts = [];
    switch (defaultExchange) {
      case KEYS_PLATFORMS_SUPPORTED.incognito:
      case KEYS_PLATFORMS_SUPPORTED.interswap:
        callContracts = Object.values(CALL_CONTRACT).filter(
          contract => !!contract,
        );
        break;
      case KEYS_PLATFORMS_SUPPORTED.pancake:
        callContracts.push(CALL_CONTRACT.PANCAKE_BSC);
        break;
      case KEYS_PLATFORMS_SUPPORTED.uni:
        callContracts.push(CALL_CONTRACT.UNI_PLG);
        break;
      case KEYS_PLATFORMS_SUPPORTED.uniEther:
        callContracts.push(CALL_CONTRACT.UNI_ETH);
        break;
      case KEYS_PLATFORMS_SUPPORTED.spooky:
        callContracts.push(CALL_CONTRACT.SPOOKY_FTM);
        break;
      case KEYS_PLATFORMS_SUPPORTED.curve:
        callContracts.push(CALL_CONTRACT.CURVE_PLG);
        break;
      case KEYS_PLATFORMS_SUPPORTED.joe:
        callContracts.push(CALL_CONTRACT.JOE_AVAX);
        break;
      case KEYS_PLATFORMS_SUPPORTED.trisolaris:
        callContracts.push(CALL_CONTRACT.TRISOLARIS_AURORA);
        break;
      default:
        callContracts = [];
        break;
    }
    history = await pDexV3.getSwapHistoryStorage({callContracts});
    history = orderBy(history, 'time', 'desc');
    await actionFetchedOrdersHistory(history);
    return history;
  } catch (error) {
    console.log('actionFetchHistory-error', error);
    new ExHandler(error).showErrorToast();
    await actionFetchFailOrderHistory();
  }
};

export const actionFetchedRewardHistories = payload =>
  fetchedRewardHistoryPdexV3(payload);

export const actionFetchFailRewardHistories = () =>
  fetchFailRewardHistoryPdexV3();

export const actionFetchRewardHistories = async () => {
  try {
    let state = getStore().getState();
    const pDexV3 = await actionGetPDexV3Inst();
    const platform = platformSelectedSelector(state);
    let rewardHistoriesApiResponse;
    if (platform?.id === KEYS_PLATFORMS_SUPPORTED.pancake) {
      rewardHistoriesApiResponse = await pDexV3.getSwapPancakeRewardHistory({
        page: 0,
        limit: 1000,
      });
    }

    if (platform.id === KEYS_PLATFORMS_SUPPORTED.uni) {
      rewardHistoriesApiResponse = await pDexV3.getSwapUniRewardHistory({
        page: 0,
        limit: 1000,
      });
    }

    if (platform.id === KEYS_PLATFORMS_SUPPORTED.curve) {
      rewardHistoriesApiResponse = await pDexV3.getSwapCurveRewardHistory({
        page: 0,
        limit: 1000,
      });
    }
    console.log('rewardHistoriesApiResponse', rewardHistoriesApiResponse);
    actionFetchedRewardHistories(rewardHistoriesApiResponse);
  } catch (error) {
    console.log('actionFetchHistory-error', error);
    actionFetchFailRewardHistories();
  }
};

export const actionFetchingOrderDetail = () => fetchingOrderDetailPdexV3();

export const actionFetchedOrderDetail = payload =>
  fetchedOrderDetailPdexV3(payload);

export const actionFetchDataOrderDetail = async () => {
  let _order = {};
  const state = getStore().getState();
  const {order} = orderDetailSelector(state);
  if (!order?.requestBurnTxInc) {
    return;
  }
  try {
    await actionFetchingOrderDetail(_order);
    const orders = (await actionFetchHistory()) || [];
    _order = orders.find(
      ({requestBurnTxInc}) => requestBurnTxInc === order?.requestBurnTxInc,
    );
  } catch (e) {
    console.log('error');
  } finally {
    if (_order) {
      await actionFetchedOrderDetail(_order);
    }
  }
};

export const actionSetDefaultPair = payload => setDefaultPairPdexV3(payload);

export const actionChangeSelectedPlatform = payload =>
  changeSelectedPlatformPdexV3;

export const actionSwitchPlatform = async platformId => {
  try {
    console.log('actionSwitchPlatform platformId ', platformId);

    await actionChangeSelectedPlatform(platformId);
    const state = getStore().getState();
    const {field} = feetokenDataSelector(state);
    const errorEstTrade = errorEstimateTradeSelector(state);
    if (!field || errorEstTrade) {
      return;
    }

    switch (platformId) {
      case KEYS_PLATFORMS_SUPPORTED.incognito:
        await actionHandleInjectEstDataForPDex();
        break;
      case KEYS_PLATFORMS_SUPPORTED.pancake:
        await actionHandleInjectEstDataForPancake();
        break;
      case KEYS_PLATFORMS_SUPPORTED.uni: {
        await actionHandleInjectEstDataForUni(platformId);
        break;
      }
      case KEYS_PLATFORMS_SUPPORTED.uniEther:
        await actionHandleInjectEstDataForUni(platformId);
        break;
      case KEYS_PLATFORMS_SUPPORTED.curve:
        await actionHandleInjectEstDataForCurve();
        break;
      case KEYS_PLATFORMS_SUPPORTED.spooky:
        await actionHandleInjectEstDataForSpooky();
        break;
      case KEYS_PLATFORMS_SUPPORTED.joe:
        await actionHandleInjectEstDataForJoe();
        break;
      case KEYS_PLATFORMS_SUPPORTED.trisolaris:
        await actionHandleInjectEstDataForTrisolaris();
        break;
      case KEYS_PLATFORMS_SUPPORTED.interswap:
        await actionHandleInjectEstDataForInterswap();
        break;
      default:
        break;
    }
  } catch (error) {
    new ExHandler(error).showErrorToast();
    throw error;
  }
};

export const actionGetMaxAmount = async () => {
  const state = getStore().getState();
  let feeData = feetokenDataSelector(state);
  let isUseTokenFee = false;
  let platform = platformSelectedSelector(state);

  const inputAmount = inputAmountSelector(state);
  const sellInputToken = inputAmount(formConfigs.selltoken);
  if (platform.id === KEYS_PLATFORMS_SUPPORTED.pancake) {
    isUseTokenFee = feeData?.pancake?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.uni) {
    isUseTokenFee = feeData?.uni?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.uniEther) {
    isUseTokenFee = feeData?.uniEther?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.curve) {
    isUseTokenFee = feeData?.curve?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.spooky) {
    isUseTokenFee = feeData?.spooky?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.joe) {
    isUseTokenFee = feeData?.joe?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.trisolaris) {
    isUseTokenFee = feeData?.trisolaris?.isUseTokenFee;
  } else if (platform.id === KEYS_PLATFORMS_SUPPORTED.interswap) {
    isUseTokenFee = feeData?.interswap?.isUseTokenFee;
  }
  const availableOriginalAmount = sellInputToken?.availableOriginalAmount;
  if (!isUseTokenFee)
    return {
      maxAmount: availableOriginalAmount,
      availableAmountText: sellInputToken.availableAmountText,
      inputPDecimals: sellInputToken.pDecimals,
    };
  const fee = feeData?.minFeeOriginal;
  let maxAmount = availableOriginalAmount - fee;
  if (maxAmount < 0) {
    maxAmount = availableOriginalAmount;
  }

  return {
    maxAmount,
    availableAmountText: sellInputToken.availableAmountText,
    inputPDecimals: sellInputToken.pDecimals,
  };
};

export const actionSaveUnifiedAlertStateById = (
  payload: ActionSaveUnifiedAlertStateByIdPayload,
) => saveUnifiedAlertStateByIdPdexV3(payload);
