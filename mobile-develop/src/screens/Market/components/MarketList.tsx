import {View} from '@components/core';
import {getCurrentRouteName} from '@src/services/RouteNameService';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {marketTabSelector} from '@src/store/setting/selectors';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import orderBy from 'lodash/orderBy';
import React, {memo} from 'react';
import {MarketTabs} from './Header';
import {ROUTE_NAMES} from '@src/router';
import {getPTokenList} from '@src/store/token/functions';
import ListView from '@src/components/core/ListView/ListView';
import {marketTokens as marketTokensSelector} from '@src/store/shared/selectors';
import {useFuse} from '@src/hooks/useFuse';

const BNB_BINANCE_TOKENID =
  'b2655152784e8639fa19521a7035f331eea1f1e911b2f3200a507ebb4554387b'; //BNB on Binance Chain

interface IMarketListProps {
  tokensFactories?: any[];
  onToggleUnVerifiedTokens?: () => void;
  toggleUnVerified?: boolean;
  renderItem: (item: any) => React.ReactNode;
  keySearch?: string;
  filterField: string;
  orderField: string;
  availableTokens?: any[];
}

const MarketList = (props: IMarketListProps) => {
  const {renderItem, keySearch = '', filterField, orderField} = props;

  const currentRouteName = getCurrentRouteName();

  const availableTokens =
    props?.availableTokens || useDebounceSelector(marketTokensSelector);

  const activeTab = useDebounceSelector(marketTabSelector);

  // Get list verifiedToken list unVerifiedTokens from list all token
  const _verifiedTokens = availableTokens
    ?.filter(token => token?.isVerified)
    .filter(token => token.tokenId !== BNB_BINANCE_TOKENID);

  const _unVerifiedTokens = availableTokens?.filter(token => !token.isVerified);

  const getMarketTokens = () => {
    let marketTokens = [];
    if (
      activeTab === MarketTabs.ALL ||
      currentRouteName === ROUTE_NAMES.MarketSearchCoins
    ) {
      marketTokens = _verifiedTokens
        .concat(_unVerifiedTokens.filter(item => item.isFollowed))
        .filter(token => !!token.defaultPoolPair);
    } else {
      marketTokens = _verifiedTokens
        .filter(item => item.isFollowed || item.tokenId === PRVIDSTR)
        .concat(_unVerifiedTokens.filter(item => item.isFollowed))
        .filter(token => !!token.defaultPoolPair);
    }
    if (orderField === 'desc') {
      marketTokens = orderBy(
        marketTokens,
        item => Number(item[filterField] || '0'),
        [orderField],
      );
      marketTokens = orderBy(
        marketTokens,
        item => [
          item.isPRV,
          item.symbol === 'BTC' || item.externalSymbol === 'BTC',
          item.symbol === 'XMR' || item.externalSymbol === 'XMR',
          item.symbol === 'ETH' || item.externalSymbol === 'ETH',
          (item.symbol === 'BNB' || item.externalSymbol === 'BNB') &&
            item.currencyType === 7,
        ], //BNB network BSC
        ['desc', orderField],
      );
    } else {
      marketTokens = orderBy(
        marketTokens,
        item => Number(item[filterField] || '0'),
        [orderField],
      );
    }

    return marketTokens;
  };

  const marketTokens = getMarketTokens();

  const [tokens, onSearchMarketTokens] = useFuse(marketTokens, {
    keys: ['displayName', 'name', 'symbol', 'pSymbol'],
    matchAllOnEmptyQuery: true,
    isCaseSensitive: false,
    findAllMatches: true,
    includeMatches: false,
    includeScore: true,
    useExtendedSearch: false,
    threshold: 0,
    location: 0,
    distance: 2,
    maxPatternLength: 32,
  });

  const [loading, setLoading] = React.useState(false);

  const onRefresh = () => {
    try {
      setLoading(true);
      getPTokenList();
      setLoading(false);
    } catch (e) {
      console.log('MarketList: error');
      setLoading(false);
    }
  };

  const isLoading = React.useMemo(() => {
    return loading;
  }, [loading]);

  React.useEffect(() => {
    onSearchMarketTokens(keySearch);
  }, [keySearch]);

  return (
    <View style={{flex: 1}}>
      <ListView
        data={tokens}
        isRefreshing={isLoading}
        onRefresh={onRefresh}
        visible
        renderItem={renderItem}
      />
    </View>
  );
};

export default memo(MarketList);
