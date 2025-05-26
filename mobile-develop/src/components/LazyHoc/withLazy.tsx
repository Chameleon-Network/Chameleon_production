import React from 'react';
import { InteractionManager } from 'react-native';
import { LoadingContainer } from '../core';

const withLazy = (WrappedComp) => (props) => {
  const { shouldLazy = true } = props;
  if (!shouldLazy) {
    return (
      <WrappedComp
        {...{
          ...props,
        }}
      />
    );
  }
  const [hidden, setHidden] = React.useState(true);
  const EmptyView = React.useMemo(
    () => (
      <LoadingContainer />
    ),
    [],
  );

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setHidden(false);
      }, 200);
    });
  }, []);

  if (hidden) return EmptyView;
  return (
    <WrappedComp
      {...{
        ...props,
      }}
    />
  );
};

export default withLazy;
