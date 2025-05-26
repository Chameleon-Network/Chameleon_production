import { View } from '@components/core';
import Header from '@src/components/Header/Header';
import { navigateToTrade } from '@src/router/NavigationServices';
import { actionSetPoolSelected } from '@src/store/pdexV3/oderLimit/functions';
import { ROOT_TAB_TRADE, TAB_SWAP_ID } from '@src/store/pdexV3/trade/constant';
import { actionChangeTab } from '@src/store/tabs/functions';
import withLazy from '@src/components/LazyHoc/withLazy';
import TokenFollow from '@src/components/Token/TokenFollow';
import React, { memo, useState } from 'react';
import { batch } from 'react-redux';
import { headerStyled } from '../Market/components/Header';
import MarketList from '../Market/components/MarketList';

interface IMarketSearchCoinsProps {
  handleToggleFollowToken: () => void;
}

const MarketSearchCoins = (props: IMarketSearchCoinsProps) => {
  const {...rest} = props;
  const [keySearch, setKeySearch] = useState('');
  const onOrderPress = item => {
    const poolId = item.defaultPoolPair;
    navigateToTrade({tabIndex: 0});
    if (poolId) {
      batch(() => {
        actionSetPoolSelected(poolId);
        actionChangeTab({
          rootTabID: ROOT_TAB_TRADE,
          tabID: TAB_SWAP_ID,
        });
      });
    }
  };
  return (
    <>
      <Header
        title="Search privacy coins"
        canSearch
        autoFocus
        titleStyled={headerStyled.title}
        isNormalSearch
        onTextSearchChange={value => {
          setKeySearch(value);
        }}
      />
      <View fullFlex borderTop style={{overflow: 'hidden', paddingTop: 0}}>
        <MarketList
          {...rest}
          keySearch={keySearch}
          renderItem={({item}) => (
            <TokenFollow
              item={item}
              key={item.tokenId}
              hideStar
              onPress={() => onOrderPress(item)}
            />
          )}
        />
      </View>
    </>
  );
};


export default withLazy(memo(MarketSearchCoins));
