import { CONSTANT_COMMONS } from '@src/constants';
import { createSelector } from 'reselect';

import { PRV } from '@services/wallet/tokenService';
import { BIG_COINS } from '@src/screens/Dex/constants';
import { getAccountWallet } from '@src/services/wallet/Wallet.shared';
import { convertUtils } from '@src/utils/convert';
import { formatAmount } from '@src/utils/token';
import { compact, fromPairs, isNaN, uniqBy } from 'lodash';
import { defaultAccountName, defaultAccountSelector } from '../account/selectors';
import { followTokensWalletSelector } from '../followList/selectors';
import { getPrivacyDataByTokenID } from '../selectedPrivacy/selectors';
import { currencySelector, decimalDigitsSelector } from '../setting/selectors';
import { internalTokensSelector, pTokensSelector } from '../token/selectors';
import { walletSelector } from '../wallet/selectors';

export const isGettingBalance = createSelector(
  state => state?.token?.isGettingBalance,
  state => state?.account?.isGettingBalance,
  defaultAccountName,
  (tokens, accounts, defaultAccountName) => {
    const isLoadingAccountBalance = accounts?.includes(defaultAccountName);
    const result = [...tokens];
    return isLoadingAccountBalance
      ? [...result, CONSTANT_COMMONS.PRV.id]
      : result;
  },
);

export const availableTokensSelector = createSelector(
  pTokensSelector,
  internalTokensSelector,
  followTokensWalletSelector,
  getPrivacyDataByTokenID,
  (pTokens, internalTokens, followedTokens, getPrivacyDataByTokenID) => {
    const followedTokenIds = followedTokens.map(t => t?.id) || [];
    const allTokenIds = Object.keys(
      fromPairs([
        ...internalTokens?.map(t => [t?.id]),
        ...pTokens?.map(t => [t?.tokenId]),
      ]),
    );
    const tokens: any[] = [];
    allTokenIds?.forEach(tokenId => {
      const token = getPrivacyDataByTokenID(tokenId);
      if (token?.name && token?.symbol && token.tokenId) {
        let _token = {...token};
        if (followedTokenIds.includes(token.tokenId)) {
          _token.isFollowed = true;
        }
        tokens.push(_token);
      }
    });
    const excludeRPV = token => token?.tokenId !== CONSTANT_COMMONS.PRV.id;
    return uniqBy(tokens.filter(excludeRPV), 'tokenId') || [];
  },
);

export const marketTokens = createSelector(
  pTokensSelector,
  internalTokensSelector,
  followTokensWalletSelector,
  getPrivacyDataByTokenID,
  (pTokens, internalTokens, followedTokens, getPrivacyDataByTokenID) => {
    const followedTokenIds = followedTokens.map(t => t?.id) || [];
    const allTokenIds = Object.keys(
      fromPairs([
        ...internalTokens?.map(t => [t?.id]),
        ...pTokens?.map(t => [t?.tokenId]),
      ]),
    );
    const tokens = [];
    allTokenIds?.forEach(tokenId => {
      const token = getPrivacyDataByTokenID(tokenId);
      if (token?.name && token?.symbol && token.tokenId) {
        let _token = {...token};
        if (
          followedTokenIds.includes(token.tokenId) &&
          !token.movedUnifiedToken
        ) {
          _token.isFollowed = true;
        }
        tokens.push(_token);
      }
    });
    return uniqBy(tokens, 'tokenId') || [];
  },
);

export const pTokenSelector = createSelector(
  getPrivacyDataByTokenID,
  currencySelector,
  (getPrivacyDataByTokenID, isToggleUSD) => {
    const decimalDigit = getPrivacyDataByTokenID(
      isToggleUSD ? BIG_COINS.USDT : BIG_COINS.PRV,
    );
    return {
      pToken: decimalDigit,
      isToggleUSD,
    };
  },
);

export const prefixCurrency = createSelector(currencySelector, isToggleUSD => {
  return isToggleUSD
    ? CONSTANT_COMMONS.USD_SPECIAL_SYMBOL
    : CONSTANT_COMMONS.PRV_SPECIAL_SYMBOL;
});

export const totalShieldedTokensSelector = createSelector(
  getPrivacyDataByTokenID,
  followTokensWalletSelector,
  pTokenSelector,
  decimalDigitsSelector,
  (getPrivacyDataByTokenID, followTokens, currency, decimalDigits) => {
    const {isToggleUSD} = currency;
    followTokens = followTokens.map(({id, amount}) => {
      const {priceUsd, pricePrv, pDecimals} = getPrivacyDataByTokenID(id);
      return {
        priceUsd,
        pricePrv,
        balance: amount,
        pDecimals,
      };
    });
    const totalShielded = compact([...followTokens]).reduce(
      (prevValue, currentValue) => {
        const totalShielded = prevValue;
        const pDecimals = currentValue?.pDecimals || 0;
        const amount = currentValue?.balance || 0;
        const price = isToggleUSD
          ? currentValue?.priceUsd
          : currentValue?.pricePrv || 0;
        let currentAmount = formatAmount(
          price,
          amount,
          pDecimals,
          pDecimals,
          decimalDigits,
          true,
        );

        if (isNaN(currentAmount)) {
          currentAmount = 0;
        }
        return currentAmount + totalShielded;
      },
      0,
    );
    return convertUtils.toOriginalAmount(totalShielded, PRV.pDecimals, true);
  },
);

export const unFollowTokensSelector = createSelector(
  availableTokensSelector,
  tokens => tokens.filter(token => !(token?.isFollowed === true)),
);

export const getDefaultAccountWalletSelector = createSelector(
  defaultAccountSelector,
  walletSelector,
  (account, wallet) => getAccountWallet(account, wallet),
);
