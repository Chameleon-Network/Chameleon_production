import BottomBar from '@src/components/core/BottomBar';
import {navigateToConvertToUnifiedToken} from '@src/router/NavigationServices';
import {switchAccountSelector} from '@src/store/account/selectors';
import {checkConvertSelector} from '@src/store/convertToUnifiedToken/selectors';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {useSelector} from 'react-redux';

const enhance = WrappedComp => props => {
  const isConvert = useSelector(checkConvertSelector);
  const switchingAccount = useSelector(switchAccountSelector);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      {isConvert && !switchingAccount && (
        <BottomBar
          onPress={navigateToConvertToUnifiedToken}
          text="You can maximize swap flexibility by unifying your privacy coins."
          autoscroll
        />
      )}
    </ErrorBoundary>
  );
};

export default enhance;
