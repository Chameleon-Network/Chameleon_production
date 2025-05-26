import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';
import { isGettingBalance as isGettingBalanceShared } from '@src/store/shared/selectors';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';

export const TokenContext = React.createContext();

const enhance = (WrappedComp) => (props) => {
  const { tokenId, item } = props;
  const colors = useTheme();
  const token = useSelector(getPrivacyDataByTokenID)(
    tokenId,
  );
  const gettingBalance = useSelector(isGettingBalanceShared);
  const isGettingBalance = gettingBalance.includes(tokenId);
  const tokenProps = {
    ...props,
    ...token,
    ...item,
    isGettingBalance,
    colors,
  };
  if (!item || !tokenId) {
    return null;
  }
  return (
    <ErrorBoundary>
      <TokenContext.Provider
        value={{
          tokenProps,
        }}
      >
        <WrappedComp {...tokenProps} />
      </TokenContext.Provider>
    </ErrorBoundary>
  );
};

export default enhance;
