import AppMaintain from '@src/components/AppMaintain';
import {CONSTANT_APP} from '@src/constants';
import useFeatureConfig from '@src/shared/hooks/useFeatureConfig';
import React from 'react';
import Home from '../HomePdexV3/Home';

const EarnScreen = React.memo(() => {
  const [_, isDisabled] = useFeatureConfig(CONSTANT_APP.DISABLED.LIQUIDITY);
  if (isDisabled) {
    return <AppMaintain />;
  }
  return <Home />;
});

export default EarnScreen;
