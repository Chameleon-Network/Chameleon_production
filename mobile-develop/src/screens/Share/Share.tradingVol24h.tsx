import React from 'react';
import { useSelector } from 'react-redux';
import { isFetchingSelector, tradingVolume24hSelector } from '@src/store/pdexV3/pools/selectors';
import { HomeTabHeader } from '../HomePdexV3/components/TabHeader';


export default React.memo(() => {
  const tradingVolume24h = useSelector(tradingVolume24hSelector);
  const loading = useSelector(isFetchingSelector);
  return <HomeTabHeader title="24h Trading Volume" desc={`$${tradingVolume24h}`} loading={loading} />;
});
