import { LoadingContainer } from '@src/components/core';
import { actionFetchPools } from '@src/store/pdexV3/pools/functions';
import { followPoolIdsSelector, isFetchingSelector } from '@src/store/pdexV3/pools/selectors';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Pool from './components/Pool';
import { poolsListHeaderFollowingStyled } from './Pools.styled';
import { Row } from '@src/components/Row';

const HEADER_FACTORIES = [
  {
    text: 'Name / Vol',
    styled: [poolsListHeaderFollowingStyled.wrapperFirstSection],
    textStyle: null,
  },
  {
    text: 'APY',
    styled: [
      poolsListHeaderFollowingStyled.wrapperSecondSection,
      poolsListHeaderFollowingStyled.centerText,
    ],
  },
];

export const PoolsListHeader = React.memo(() => {
  return (
    <Row style={{ marginVertical: 15, justifyContent: 'space-between' }}>
      {HEADER_FACTORIES.map((item) => (
        <Text
          key={item.text}
          style={[poolsListHeaderFollowingStyled.text, item.styled]}
        >
          {item.text}
        </Text>
      ))}
    </Row>
  );
});

interface IPoolsListFollowingProps {
  handlePressPool: (poolId: string) => void;
}

export const PoolsListFollowing = React.memo(({ handlePressPool }: IPoolsListFollowingProps) => {
  const dispatch = useDispatch();
  const followIds = useSelector(followPoolIdsSelector) || [];
  const isFetching = useSelector(isFetchingSelector);
  const onPressPool = (poolId: string) => {
    typeof handlePressPool === 'function' && handlePressPool(poolId);
  };
  const renderItem = (poolId: string) => (
    <Pool
      key={poolId}
      poolId={poolId}
      onPressPool={onPressPool}
      checkFollow={false}
    />
  );
  const renderContent = () => {
    if (isFetching) return <LoadingContainer />;
    return <View>{followIds.map(renderItem)}</View>;
  };
  useEffect(() => {
    actionFetchPools()
  }, []);
  return renderContent();
});

interface IPoolsProps {
  handlePressPool: (poolId: string) => void
}
const Pools = (props: IPoolsProps) => {
  const { handlePressPool } = props;
  return (
    <View>
      <PoolsListHeader />
      <PoolsListFollowing handlePressPool={handlePressPool} />
    </View>
  );
};

export default React.memo(Pools);
