import {createSelector} from 'reselect';
import format from '@utils/format';
import BigNumber from 'bignumber.js';
import { liquiditySelector } from './selectors';
import { getPrivacyDataByTokenID, getPrivacyPRVInfo, validatePRVBalanceSelector } from '@src/store/selectedPrivacy/selectors';
import { minPRVNeededSelector } from '@src/store/refillPRV/selector';
import { isGettingBalance } from '@src/store/shared/selectors';
import { getInputAmount } from './utils';
import { getPoolSize } from '../utils';
import { formConfigsContribute } from './constants';
import { nftTokenDataSelector } from '@src/store/account/selectors';
import { listShareSelector } from '../portforlio/selectors';

export const contributeSelector = createSelector(
  liquiditySelector,
  (liquidity) => liquidity?.contribute,
);

export const poolIDSelector = createSelector(
  contributeSelector,
  ({ poolId }) => poolId,
);

export const statusSelector = createSelector(
  contributeSelector,
  ({ isFetching }) => isFetching,
);

export const poolDataSelector = createSelector(
  contributeSelector,
  ({ data }) => data,
);

export const tokenSelector = createSelector(
  contributeSelector,
  getPrivacyDataByTokenID,
  ({ inputToken, outputToken }, getPrivacyDataByTokenID) => {
    if (!inputToken || !outputToken) return {};
    const _inputToken = getPrivacyDataByTokenID(inputToken);
    const _outputToken = getPrivacyDataByTokenID(outputToken);
    return {
      inputToken: _inputToken,
      outputToken: _outputToken,
    };
  },
);

export const feeAmountSelector = createSelector(
  contributeSelector,
  getPrivacyDataByTokenID,
  ({ feeAmount, feeToken }, getPrivacyDataByTokenID) => {
    const token = getPrivacyDataByTokenID(feeToken);
    const tokenAmount = token.amount;
    const showFaucet = tokenAmount < feeAmount;
    return { feeAmount, feeToken, token, feeAmountStr: format.amountFull(feeAmount, token.pDecimals), showFaucet };
  },
);

export const validateNetworkFeeSelector = createSelector(
  getPrivacyPRVInfo,
  feeAmountSelector,
  minPRVNeededSelector,
  (prvBalanceInfo, feeAmountData, minPRVNeeded) => {
    const { prvBalanceOriginal} = prvBalanceInfo;
    const { feeAmount } = feeAmountData;
    const isEnoughNetworkFee = new BigNumber(prvBalanceOriginal).gt(new BigNumber(feeAmount));
    return {
      isEnoughNetworkFee
    };
  }
);


export const inputAmountSelector = createSelector(
  (state) => state,
  isGettingBalance,
  tokenSelector,
  feeAmountSelector,
  getInputAmount
);

export const mappingDataSelector = createSelector(
  contributeSelector,
  getPrivacyDataByTokenID,
  tokenSelector,
  isGettingBalance,
  feeAmountSelector,
  inputAmountSelector,
  getPrivacyPRVInfo,
  validateNetworkFeeSelector,
  (
    { data: poolData, nftId },
    getPrivacyDataByTokenID,
    { inputToken, outputToken },
    isGettingBalance,
    { token: feeToken, feeAmountStr },
    inputAmount,
    prvBalanceInfo,
    validateNetworkFeeData,
  ) => {
    if (!poolData || !inputToken || !outputToken) return {};
    const { symbol } = prvBalanceInfo;
    const { isEnoughNetworkFee} = validateNetworkFeeData;
    const { token1Value: token1PoolValue, token2Value: token2PoolValue, price, virtual1Value, virtual2Value } = poolData;
    const poolSize = getPoolSize(inputToken, outputToken, token1PoolValue, token2PoolValue);
    const input = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const output = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    const isLoadingBalance =
      isGettingBalance.includes(inputToken?.tokenId)
      || isGettingBalance.includes(outputToken?.tokenId)
      || isGettingBalance.includes(feeToken?.tokenId);

    // Calculator current price
    let currentPrice = format.amountVer2(price, 0);
    let currentPriceStr = `1 ${input.symbol} = ${currentPrice} ${output.symbol}`;

    const percent = 100;
    // Ratio
    let token1Ratio = new BigNumber(token1PoolValue)
      .div(new BigNumber(token1PoolValue)
        .plus(new BigNumber(token2PoolValue)
          .div(new BigNumber(virtual2Value)
            .div(virtual1Value))))
      .multipliedBy(percent).toFixed(2);
    let token2Ratio = new BigNumber(percent).minus(token1Ratio);
    token1Ratio = format.amountVer2(token1Ratio, 0);
    token2Ratio = format.amountVer2(token2Ratio.toString(), 0);
    const poolRatioStr = `${token1Ratio}% ${input.symbol} - ${token2Ratio}% ${output.symbol}`;

    const hookFactories = [
      // {
      //   label: 'Pool size',
      //   value: poolSize,
      // },
      // {
      //   label: 'Current price',
      //   value: currentPriceStr,
      // },
      // {
      //   label: 'Pool ratio',
      //   value: poolRatioStr
      // },
      {
        label: `${input.symbol} Balance`,
        value: input.maxAmountDisplay,
      },
      {
        label: `${output.symbol} Balance`,
        value: output.maxAmountDisplay,
      },
      // !isEnoughNetworkFee ? {
      //   label: 'Network Fee',
      //   value: `${feeAmountStr} ${symbol}`,
      // }: undefined,
      {
        label: 'Network Fee',
        value: `${feeAmountStr} ${symbol}`,
      },
    ];
    return {
      ...poolData,
      hookFactories,
      inputToken,
      outputToken,
      token1PoolValue,
      token2PoolValue,
      isLoadingBalance,
      nftId,
    };
  }
);

export const validateTotalBurnPRVSelector = createSelector(
  getPrivacyPRVInfo,
  feeAmountSelector,
  minPRVNeededSelector,
  inputAmountSelector,
  validatePRVBalanceSelector,
  (prvBalanceInfo, feeAmountData, minPRVNeeded, inputAmount, validatePRVBalanceFn) => {
    try {
      const { prvBalanceOriginal, PRV_ID, feePerTx } = prvBalanceInfo;
      const { feeAmount } = feeAmountData;
  
      const input = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
      const output = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
  
      const { tokenId: token1Id, originalInputAmount: originalInputAmount1 } = input;
      const { tokenId: token2Id, originalInputAmount: originalInputAmount2 } = output;
  
      // console.log('LD-Contribute [validateTotalBurnPRVSelector] ', {
      //   input,
      //   output,
      //   feeAmountData,
      //   prvBalanceInfo
      // } );
  
      let totalBurningPRV = 0;
    
      // SellToken = PRV
      if (token1Id === PRV_ID) {
        totalBurningPRV = totalBurningPRV + originalInputAmount1;
      } 
  
      if (token2Id === PRV_ID) {
        totalBurningPRV = totalBurningPRV + originalInputAmount2;
      } 

      totalBurningPRV = totalBurningPRV + feeAmount;
  
      if (!totalBurningPRV || totalBurningPRV == 0) {
        totalBurningPRV = feePerTx;
      }
  
      // console.log('LD-Contribute [validateTotalBurnPRVSelector] ==>> ', {
      //   prvBalanceOriginal,
      //   totalBurningPRV,
      //   minPRVNeeded
      // });
  
      return validatePRVBalanceFn(totalBurningPRV);

  
    } catch (error) {
      console.log('LD-Contribute [validateTotalBurnPRVSelector]  ERROR : ', error);
    }
  }
);


export const nftTokenSelector = createSelector(
  poolIDSelector,
  nftTokenDataSelector,
  contributeSelector,
  listShareSelector,
  (
    poolId,
    nftData,
    { nftId },
    listShare,
  ) => {
    const { nftToken } = nftData;
    let res = {
      nftToken,
    };
    if (nftId) {
      res.nftToken = nftId;
      return res;
    }
    if (listShare && listShare.length > 0) {
      const pool = listShare.find(share => share.poolId === poolId);
      if (pool && pool.nftId) {
        res.nftToken = pool.nftId;
      }
    }
    return res;
  }
);

export const disableContribute = createSelector(
  statusSelector,
  inputAmountSelector,
  nftTokenSelector,
  ( isFetching, inputAmount, nftData ) => {
    const { nftToken } = nftData;
    const { error: inputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.inputToken);
    const { error: outputError } = inputAmount(formConfigsContribute.formName, formConfigsContribute.outputToken);
    const isDisabled = isFetching || !!inputError || !!outputError || !nftToken;
    return { isDisabled, nftTokenAvailable: !!nftToken };
  }
);
