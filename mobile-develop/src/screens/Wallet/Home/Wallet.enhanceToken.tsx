import React from 'react';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';

export const TokenContext = React.createContext();

const enhance = (WrappedComp) => (props) => {
  const { tokenId, amount } = props;
  const token = useDebounceSelector(getPrivacyDataByTokenID)(
    tokenId,
  );

  const tokenProps = React.useMemo(() => ({
    ...props,
    ...token,
    amount,
    symbol: token?.symbol || token?.externalSymbol || '',
  }), [amount, token.name, token.priceUsd]);

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
