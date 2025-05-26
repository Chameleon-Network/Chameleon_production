import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { actionFetchNews } from './News.actions';

const enhance = (WrappedComp: React.ComponentType<any>) => (props: any) => {
  const handleFetchNews = async () => {
    try {
      actionFetchNews()
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleFetchNews }} />
    </ErrorBoundary>
  );
};

export default enhance;
