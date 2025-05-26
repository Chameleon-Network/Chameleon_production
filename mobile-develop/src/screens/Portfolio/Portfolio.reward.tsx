import React, {memo} from 'react';

import {RefreshControl} from '@components/core';
import {EmptyBookIcon} from '@components/Icons';
import {styled} from './Portfolio.styled';
import RewardItem from './Portfolio.rewardItem';
import orderBy from 'lodash/orderBy';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';
import uniq from 'lodash/uniq';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import {validatePRVBalanceSelector} from '@src/store/selectedPrivacy/selectors';
import {useSelector} from '@src/store/getStore';
import {
  getDataByShareIdSelector,
  listShareSelector,
} from '@src/store/pdexV3/portforlio/selectors';
import {actionRefillPRVModalVisible} from '@src/store/refillPRV/functions';
import {FlatList} from 'react-native';
import {actionFetch} from '@src/store/pdexV3/portforlio/functions';
import {withTransaction} from '../Liquidity/Liquidity.enhanceTransaction';
import {actionFaucetPRV} from '@src/store/token/functions';

interface PortfolioRewardProps {
  onCreateWithdrawFeeLP: (params: any) => void;
}

const PortfolioReward = ({onCreateWithdrawFeeLP}: PortfolioRewardProps) => {
  const data = useSelector(listShareSelector);
  const listShare = React.useMemo(() => {
    if (!data) return [];
    return orderBy(data, 'totalRewardAmount', 'desc').filter(
      item => item.withdrawable,
    );
  }, [data]);
  const getDataShare = useSelector(getDataByShareIdSelector);
  const {isEnoughtPRVNeededAfterBurn, isCurrentPRVBalanceExhausted} =
    useSelector(validatePRVBalanceSelector)(ACCOUNT_CONSTANT.MAX_FEE_PER_TX);

  const onWithdrawFeeLP = ({poolId, shareId}) => {
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

    if (isCurrentPRVBalanceExhausted) {
      actionFaucetPRV(<FaucetPRVModal />);
      return;
    }

    if (!isEnoughtPRVNeededAfterBurn) {
      actionRefillPRVModalVisible(true);
      return;
    }
    onCreateWithdrawFeeLP(params);
  };
  return (
    <FlatList
      data={listShare}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={() => actionFetch()} />
      }
      renderItem={({item, index}) => (
        <RewardItem
          data={item}
          onWithdrawFeeLP={onWithdrawFeeLP}
          isLast={index === data.length - 1}
        />
      )}
      keyExtractor={item => item?.shareId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{flexGrow: 1, paddingTop: 8}]}
      ListEmptyComponent={
        <EmptyBookIcon message="Join a pool to start earning rewards." />
      }
      style={styled.list}
    />
  );
};

export default withTransaction(memo(PortfolioReward));
