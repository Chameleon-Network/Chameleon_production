import React from 'react';
import { useSearchBox } from '@src/components/Header';
import orderBy from 'lodash/orderBy';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { useTokenList } from './Token.useEffect';
import { useNavigation } from '@react-navigation/native';
import { ROUTE_NAMES } from '@src/router';
import { handleFilterTokenByKeySearch } from '@src/utils/token';
import ErrorBoundary from 'react-native-error-boundary';
import { availableTokensSelector } from '@src/store/shared/selectors';
import { marketTabSelector } from '@src/store/setting/selectors';
import { MarketTabs } from '@src/screens/Market/components/Header';

const enhance = (WrappedComp) => (props) => {
  const { filterField, orderField } = props;
  let availableTokens =
    props?.availableTokens || useDebounceSelector(availableTokensSelector);
  const activeTab = useDebounceSelector(marketTabSelector);
  const navigation = useNavigation();
  const { verifiedTokens, unVerifiedTokens } = React.useMemo(() => {
    let verifiedTokens = [];
    let unVerifiedTokens = [];
    // remove tokens has convert to unified token when current screen is Shield
    if (navigation?.state?.routeName === ROUTE_NAMES.Shield) {
      availableTokens = availableTokens?.filter(
        (token) => token?.movedUnifiedToken === false,
      );
    }
    availableTokens.map((token) =>
      token?.isVerified || token?.verified
        ? verifiedTokens.push(token)
        : unVerifiedTokens.push(token),
    );
    return {
      verifiedTokens,
      unVerifiedTokens,
    };
  }, [availableTokens]);

  const [toggleUnVerified, onToggleUnVerifiedTokens] = useTokenList();
  const [_verifiedTokens, keySearch, handleFilterData] = useSearchBox({
    data: verifiedTokens,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({ tokens: verifiedTokens, keySearch }),
  });
  const [_unVerifiedTokens, _keySearch, _handleFilterData] = useSearchBox({
    data: unVerifiedTokens,
    shouldCleanSearch: false,
    handleFilter: () =>
      handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      }),
  });

  React.useEffect(() => {
    const __verifiedTokens = handleFilterTokenByKeySearch({
      tokens: verifiedTokens,
      keySearch,
    });
    handleFilterData(__verifiedTokens);
    if (toggleUnVerified) {
      const __unVerifiedTokens = handleFilterTokenByKeySearch({
        tokens: unVerifiedTokens,
        keySearch: _keySearch,
      });
      _handleFilterData(__unVerifiedTokens);
    }
  }, [availableTokens]);

  const tokensFactories = React.useMemo(() => {
    let _verifiedTokens1 = _verifiedTokens;
    let marketTokens = [];
    if (activeTab === MarketTabs.ALL) {
      marketTokens = _verifiedTokens
        .concat(_unVerifiedTokens.filter((item) => item.isFollowed))
        .filter((token) => !!token.defaultPoolPair);
    } else {
      marketTokens = _verifiedTokens
        .filter((item) => item.isFollowed || item.tokenId === PRVIDSTR)
        .concat(_unVerifiedTokens.filter((item) => item.isFollowed))
        .filter((token) => !!token.defaultPoolPair);
    }
    marketTokens = orderBy(
      marketTokens,
      (item) => Number(item[filterField] || '0'),
      [orderField],
    );
    if (!keySearch) {
      _verifiedTokens1 = orderBy(
        _verifiedTokens,
        ['isPRV', 'isPUnifiedToken', 'network', 'symbol'],
        ['desc', 'desc', 'asc', 'asc'],
      );
    } else {
      _verifiedTokens1 = orderBy(
        _verifiedTokens,
        (item) => Number(item[filterField] || '0'),
        [orderField],
      );
    }

    const __unVerifiedTokens = orderBy(
      _unVerifiedTokens,
      (item) => Number(item[filterField] || '0'),
      [orderField],
    );
    return [
      {
        // data: _verifiedTokens,
        data: _verifiedTokens1,
        visible: true,
        styledListToken: { paddingTop: 0 },
      },
      {
        data: __unVerifiedTokens,
        visible: toggleUnVerified,
        styledListToken: { paddingTop: 15 },
      },
      {
        data: marketTokens,
        visible: true,
        styledListToken: { paddingTop: 15 },
      },
    ];
  }, [
    _unVerifiedTokens,
    _verifiedTokens,
    toggleUnVerified,
    filterField,
    orderField,
    activeTab,
    keySearch,
  ]);

  React.useEffect(() => {
    if (toggleUnVerified && !keySearch) {
      onToggleUnVerifiedTokens();
    }
  }, [keySearch]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          tokensFactories,
          toggleUnVerified,
          onToggleUnVerifiedTokens,
          keySearch,
        }}
      />
    </ErrorBoundary>
  );
};
enhance.defaultProps = {
  filterField: 'change',
  orderField: 'desc',
};
export default enhance;
