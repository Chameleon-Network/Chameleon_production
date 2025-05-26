import { LoadingContainer, View } from '@components/core';
import { searchToken } from '@services/api/token';
import BtnQuestionDefault from '@src/components/Button/BtnQuestionDefault';
import { useSearchBox } from '@src/components/Header';
import Header from '@src/components/Header/Header';
import withLazy from '@src/components/LazyHoc/withLazy';
import ListAllToken2 from '@src/components/Token/ListAllToken2';
import { useTokenList } from '@src/components/Token/Token.useEffect';
import TokenFollow from '@src/components/Token/TokenFollow';
import { COINS, CONSTANT_APP } from '@src/constants';
import useDebounceSelector from '@src/hooks/useDebounceSelector';
import { ROUTE_NAMES } from '@src/router';
import {
  navigateToChooseNetworkForShield,
  navigateToWhyShield,
} from '@src/router/NavigationServices';
import { getCurrentRouteName } from '@src/services/RouteNameService';
import useFeatureConfig from '@src/shared/hooks/useFeatureConfig';
import { RULE_SORT } from '@src/store/pdexV3/swap/constants';
import { setSelectedPrivacy } from '@src/store/selectedPrivacy';
import {
  getPrivacyDataByTokenID,
  selectedPrivacy,
} from '@src/store/selectedPrivacy/selectors';
import { availableTokensSelector } from '@src/store/shared/selectors';
import { internalTokens, pTokens } from '@src/store/token/selectors';
import { FONTS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import { handleFilterTokenByKeySearch } from '@src/utils/token';
import _, { debounce, orderBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { styled } from './Shield.styled';
import PToken from '@src/models/pToken';
interface IShieldScreen {
  handleWhyShield: () => void;
  handleShield: (token: any) => void;
  tokensFactories: any[];
  hideBackButton?: boolean;
  availableTokens: any[];
}

//TODO: NEED TO VERIFY CODE OF THIS SCREEN ONE MORE TIME
const ShieldScreen = (props: IShieldScreen) => {
  const {hideBackButton = false, showOriginalSymbol} = props;
  const onlyPToken = true;
  const _pTokens: PToken[] = useDebounceSelector(pTokens) || [];
  const _internalTokens = useDebounceSelector(internalTokens);
  const _selectedPrivacy = useDebounceSelector(selectedPrivacy);

  const [showUnVerifiedTokens, setShowUnVerifiedTokens] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const allTokens = React.useMemo(() => {
    let allTokens = [];
    if (!_pTokens || _pTokens.length === 0) return [];
    if (onlyPToken) {
      allTokens = _(_pTokens)?.map(item => ({
        ...item,
        id: item.tokenId,
        displaySymbol: showOriginalSymbol ? item.symbol : item.pSymbol,
      }));
    } else {
      allTokens = _(_internalTokens)
        ?.filter(token => token.name && token.symbol)
        .filter(item => !_pTokens?.find(i => i?.tokenId === item?.id))
        .concat(
          _pTokens?.map(item => ({
            ...item,
            id: item?.tokenId,
          })),
        )
        .map(item => ({
          ...item,
          displaySymbol: showOriginalSymbol
            ? item?.symbol
            : item?.pSymbol || item?.symbol,
        }));
    }

    allTokens = allTokens
      .orderBy(item => COINS.POPULAR_COIN_IDS.indexOf(item.id), 'desc')
      .uniqBy(item => item?.id)
      .value();

    if (!onlyPToken) {
      allTokens = [
        {
          id: '0000000000000000000000000000000000000000000000000000000000000004',
          name: 'Incognito',
          displayName: 'Privacy',
          symbol: 'PRV',
          displaySymbol: 'PRV',
          pDecimals: 9,
          originalSymbol: 'PRV',
          verified: true,
        },
        ...allTokens,
      ];
    }

    if (onlyPToken && !_selectedPrivacy.isPToken) {
      const firstPToken = allTokens?.find(item =>
        pTokens?.find(token => token?.tokenId === item?.id),
      );

      if (firstPToken) {
        setSelectedPrivacy(firstPToken?.id);
      } else {
        setSelectedPrivacy(_pTokens[0]?.tokenId);
      }
    }
    return allTokens;
  }, [_pTokens, _internalTokens]);

  const availableTokens = React.useMemo(() => {
    return allTokens
      .map(token => getPrivacyDataByTokenID(token?.tokenId))
      .filter(token => token?.isDeposable);
  }, [allTokens.length]);

  const [tokenList, setTokenList] = useState(availableTokens);

  const [verifiedTokens, unVerifiedTokens] = useMemo(() => {
    const resultFiltered = tokenList.reduce(
      (result, token) => {
        if (token?.isVerified && !token?.movedUnifiedToken) {
          result.verifiedTokens.push(token);
        } else if (!token?.isVerified && !token?.movedUnifiedToken) {
          result.unVerifiedTokens.push(token);
        } else {
          // console.log('TOKEN MOVED UNIFIED => ', token.tokenId);
        }
        return result;
      },
      {
        verifiedTokens: [],
        unVerifiedTokens: [],
      },
    );
    return [resultFiltered.verifiedTokens, resultFiltered.unVerifiedTokens];
  }, tokenList);

  const onSetShowUnVerifiedTokens = () => {
    setShowUnVerifiedTokens(!showUnVerifiedTokens);
  };

  let tokens = [];
  if (tokenList && tokenList.length < 1) {
    tokens = [];
  } else if (!verifiedTokens && !unVerifiedTokens) {
    tokens = [];
  } else if (verifiedTokens && verifiedTokens.length < 1) {
    tokens = [unVerifiedTokens];
  } else if (unVerifiedTokens && unVerifiedTokens.length < 1) {
    tokens = [verifiedTokens];
  } else if (!showUnVerifiedTokens) {
    tokens = [verifiedTokens];
  } else if (showUnVerifiedTokens) {
    tokens = [verifiedTokens, unVerifiedTokens];
  }

  const debounceSearch = debounce(async nextValue => {
    setShowUnVerifiedTokens(false);
    if (!nextValue || nextValue.length < 1) {
      setTokenList(availableTokens);
    } else {
      setLoading(true);
      const result = (await searchToken(nextValue)) || [];
      setLoading(false);
      if (result && result.length < 1) {
        setTokenList([]);
      } else {
        setTokenList(orderBy(result, RULE_SORT.key, RULE_SORT.value));
      }
    }
    setLoading(false);
  }, 500);

  //TokenSelectEnhance
  const [onCentralizedPress, isCentralizedDisabled] = useFeatureConfig(
    CONSTANT_APP.DISABLED.SHIELD_CENTRALIZED,
  );
  const [onDecentralizedPress, isDecentralizedDisabled] = useFeatureConfig(
    CONSTANT_APP.DISABLED.SHIELD_DECENTRALIZED,
  );

  const isTokenSelectable = tokenId => {
    if (!tokenId) {
      return false;
    }

    const tokenData = getPrivacyDataByTokenID(tokenId); //TODO: ??????? WHY OLD CODE DO THIS?
    if (onlyPToken) {
      if (isDecentralizedDisabled && tokenData?.isDecentralized) {
        onDecentralizedPress();
        return false;
      }

      if (isCentralizedDisabled && tokenData?.isCentralized) {
        onCentralizedPress();
        return false;
      }
    }

    return true;
  };

  const handleWhyShield = useCallback(() => navigateToWhyShield(), []);
  const handleShield = async item => {
    try {
      if (!isTokenSelectable(item?.tokenId)) {
        return;
      }
      // setTimeout(() => {
      //   dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.SHIELD));
      // }, 300);
      navigateToChooseNetworkForShield({
        tokenSelected: item,
      });
    } catch (error) {
      console.debug('SHIELD ERROR', error);
    }
  };

  // TokenVerify enhance
  let tokenVerifyAvailableTokens =
    props?.availableTokens || useDebounceSelector(availableTokensSelector);
  const {verifiedTokensEnhance, unVerifiedTokensEnhance} = React.useMemo(() => {
    let verifiedTokens = [];
    let unVerifiedTokens = [];
    // remove tokens has convert to unified token when current screen is Shield
    if (getCurrentRouteName() === ROUTE_NAMES.Shield) {
      tokenVerifyAvailableTokens = tokenVerifyAvailableTokens?.filter(
        token => token?.movedUnifiedToken === false,
      );
    }
    tokenVerifyAvailableTokens.map(token =>
      token?.isVerified || token?.verified
        ? verifiedTokens.push(token)
        : unVerifiedTokens.push(token),
    );
    return {
      verifiedTokensEnhance: verifiedTokens,
      unVerifiedTokensEnhance: unVerifiedTokens,
    };
  }, [tokenVerifyAvailableTokens]);

  const [toggleUnVerified, onToggleUnVerifiedTokens] = useTokenList();
  const [_verifiedTokens, keySearch, handleFilterData] = useSearchBox({
    data: verifiedTokensEnhance,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({tokens: verifiedTokensEnhance, keySearch}),
  });
  const [_unVerifiedTokens, _keySearch, _handleFilterData] = useSearchBox({
    data: unVerifiedTokensEnhance,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({
        tokens: unVerifiedTokensEnhance,
        keySearch: _keySearch,
      }),
  });

  useEffect(() => {
    const __verifiedTokens = handleFilterTokenByKeySearch({
      tokens: verifiedTokensEnhance,
      keySearch,
    });
    handleFilterData(__verifiedTokens);
    if (toggleUnVerified) {
      const __unVerifiedTokens = handleFilterTokenByKeySearch({
        tokens: unVerifiedTokensEnhance,
        keySearch: _keySearch,
      });
      _handleFilterData(__unVerifiedTokens);
    }
  }, [tokenVerifyAvailableTokens]);

  useEffect(() => {
    if (toggleUnVerified && !keySearch) {
      onToggleUnVerifiedTokens();
    }
  }, [keySearch]);

  //End of TokenVerify enhance


  return (
    <>
      <Header
        title="Search coins"
        canSearch
        isNormalSearch
        onTextSearchChange={value => {
          debounceSearch(value);
        }}
        titleStyled={FONTS.TEXT.incognitoH4}
        hideBackButton={hideBackButton}
        rightHeader={
          <BtnQuestionDefault
            style={{marginLeft: 8}}
            onPress={handleWhyShield}
            customStyle={styled.rightItem}
          />
        }
      />
      <View borderTop style={styled.container}>
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <ListAllToken2
            tokensFactories={tokens}
            styledCheckBox={globalStyled.defaultPaddingHorizontal}
            setShowUnVerifiedTokens={onSetShowUnVerifiedTokens}
            isShowUnVerifiedTokens={showUnVerifiedTokens}
            renderItem={({item}) => (
              <TokenFollow
                item={item}
                key={item.tokenId}
                hideStar
                externalSymbol
                onPress={() => handleShield(item)}
              />
            )}
          />
        )}
      </View>
    </>
  );
};
export default withLazy(ShieldScreen);
