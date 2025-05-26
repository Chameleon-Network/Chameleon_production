import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {NFTTokenBottomBar} from '@screens/PDexV3/features/NFTToken';

const enhance = WrappedComp => props => {
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      <NFTTokenBottomBar />
    </ErrorBoundary>
  );
};

export default enhance;
