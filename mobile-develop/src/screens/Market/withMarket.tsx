import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import withHome from '../Home/withHome';

const withMarket = (WrappedComp) => (props) => {
  const [filter, setFilter] = React.useState({
    filterField: 'change',
    orderField: 'desc',
  });
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          ...filter,
          onFilter: setFilter,
        }}
      />
    </ErrorBoundary>
  );
};

export default withHome(withMarket);
