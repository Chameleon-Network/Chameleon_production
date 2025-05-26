import React from 'react';
import {FlatList, View} from 'react-native';
import {RefreshControl} from '@components/core';
import {EmptyBookIcon} from '@components/Icons';
import uniq from 'lodash/uniq';
import {styled} from './Portfolio.styled';
import PortfolioItem from './Portfolio.item';
import {useSelector} from '@src/store/getStore';
import {
  getDataByShareIdSelector,
  listShareIDsSelector,
} from '@src/store/pdexV3/portforlio/selectors';
import {withTransaction} from '../Liquidity/Liquidity.enhanceTransaction';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';
import {validatePRVBalanceSelector} from '@src/store/selectedPrivacy/selectors';
import {actionFetch} from '@src/store/pdexV3/portforlio/functions';
import {actionRefillPRVModalVisible} from '@src/store/refillPRV/functions';

const PortfolioList = withTransaction(
  React.memo(({onCreateWithdrawFeeLP}: {onCreateWithdrawFeeLP: any}) => {
    const data = useSelector(listShareIDsSelector);
    const getDataShare = useSelector(getDataByShareIdSelector);
    const {isEnoughtPRVNeededAfterBurn, isCurrentPRVBalanceExhausted} =
      useSelector(validatePRVBalanceSelector)(ACCOUNT_CONSTANT.MAX_FEE_PER_TX);

    const onWithdrawFeeLP = ({
      poolId,
      shareId,
    }: {
      poolId: string;
      shareId: string;
    }) => {
      const dataShare = getDataShare(shareId);
      if (!dataShare && typeof onCreateWithdrawFeeLP !== 'function') return;
      const {nftId, tokenId1, tokenId2, rewards, orderRewards} = dataShare;
      let tokenIDs = [tokenId1, tokenId2]
        .concat(Object.keys(rewards || {}))
        .concat(Object.keys(orderRewards || {}));
      tokenIDs = uniq(tokenIDs.map(tokenID => tokenID.toLowerCase()));
      const params = {
        fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
        withdrawTokenIDs: tokenIDs,
        poolPairID: poolId,
        nftID: nftId,
        amount1: String(0),
        amount2: String(0),
      };
      if (!isEnoughtPRVNeededAfterBurn) {
        actionRefillPRVModalVisible(true);
        return;
      }
      onCreateWithdrawFeeLP(params);
    };
    return (
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => actionFetch()} />
        }
        renderItem={({item, index}) => (
          <PortfolioItem
            shareId={item}
            onWithdrawFeeLP={onWithdrawFeeLP}
            isLast={index === data.length - 1}
          />
        )}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{flexGrow: 1}]}
        ListEmptyComponent={
          <EmptyBookIcon message="Join a pool to contribute liquidity and earn rewards." />
        }
        style={styled.list}
      />
    );
  }),
);

const Portfolio = () => {
  return (
    <View style={styled.container}>
      <PortfolioList />
    </View>
  );
};

export default React.memo(Portfolio);
