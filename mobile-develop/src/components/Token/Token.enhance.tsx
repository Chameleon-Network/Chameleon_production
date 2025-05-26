import { useSelector } from '@src/store/getStore';
import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';
import { isGettingBalance as sharedIsGettingBalance } from '@src/store/shared/selectors';
import React from 'react';

export const TokenContext = React.createContext();

const enhance = (WrappedComp: React.ComponentType<any>) => (props: any) => {
  const { tokenId } = props;
  const token = useSelector(getPrivacyDataByTokenID)(
    tokenId,
  );

  const gettingBalance = useSelector(sharedIsGettingBalance);
  const isGettingBalance = gettingBalance.includes(tokenId);
  const tokenProps = {
    ...props,
    ...token,
    isGettingBalance,
    symbol: token?.externalSymbol || token?.symbol || '',
  };
  if (!token || !tokenId) {
    return null;
  }
  return (
    <TokenContext.Provider
      value={{
        tokenProps,
      }}
    >
      <WrappedComp {...tokenProps} />
    </TokenContext.Provider>
  );
};

export default enhance;
