import React from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import PaperIcon from '@components/Icons/icon.paper';
import { navigateToLiquidityHistories } from '@src/router/NavigationServices';
import { HomeTabHeader } from '../HomePdexV3/components/TabHeader';
import { isFetchingSelector, totalRewardCollectedSelector } from '@src/store/pdexV3/portforlio/selectors';

const HistoryIcon = React.memo(() => {
  return (
    <TouchableOpacity onPress={() => navigateToLiquidityHistories()}>
      <PaperIcon />
    </TouchableOpacity>
  );
});

export default React.memo(() => {
  const totalShare = useSelector(totalRewardCollectedSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="Total rewards" desc={`$${totalShare}`} loading={loading} rightIcon={<HistoryIcon />} />;
});
