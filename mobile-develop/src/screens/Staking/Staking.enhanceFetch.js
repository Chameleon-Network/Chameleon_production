import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {batch, useDispatch} from 'react-redux';
import {stakingActions} from '@screens/PDexV3/features/Staking/index';

const enhanceFetch = WrappedComp => props => {
  const dispatch = useDispatch();
  const handleFetchCoins = () => dispatch(stakingActions.actionFetchCoins());
  const onFreeData = () => dispatch(stakingActions.actionChangeAccount());
  const handleFetchStakingPools = () => dispatch(stakingActions.actionFetchStakingPools());
  const handleFetchData = () => {
    batch(() => {
      onFreeData();
      handleFetchCoins();
      dispatch(stakingActions.actionFetchStakingPools());
    });
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleFetchCoins,
          onFreeData,
          handleFetchStakingPools,
          handleFetchData,
        }}
      />
    </ErrorBoundary>
  );
};
export default enhanceFetch;

