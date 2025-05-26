import React, {memo} from 'react';
import {useSelector} from 'react-redux';
import AddSolidIcon from '@components/Icons/icon.addSolid';
import { TouchableOpacity } from 'react-native';
import { navigateToCreatePool } from '@src/router/NavigationServices';
import { isFetchingSelector, totalContributedUSDSelector } from '@src/store/pdexV3/portforlio/selectors';
import { HomeTabHeader } from '../HomePdexV3/components/TabHeader';

const CreatePoolIcon = React.memo(() => {
  return (
    <TouchableOpacity onPress={() => navigateToCreatePool()}>
      <AddSolidIcon />
    </TouchableOpacity>
  );
});

const ReturnLP = () => {
  const totalShare = useSelector(totalContributedUSDSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="Pool Balance" desc={`$${totalShare}`} loading={loading} rightIcon={<CreatePoolIcon />} />;
};

export default memo(ReturnLP);
