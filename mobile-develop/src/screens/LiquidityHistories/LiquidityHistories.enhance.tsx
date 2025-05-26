import {actionGetHistories} from '@src/store/pdexV3/liquidityHistories/functions';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';

const withHistories = WrappedComp => props => {
  const onRefresh = () => actionGetHistories();
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onRefresh,
        }}
      />
    </ErrorBoundary>
  );
};

export default withHistories;
