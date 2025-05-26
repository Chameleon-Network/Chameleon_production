import { TouchableOpacity, View } from '@src/components/core';
import { useSelector } from '@src/store/getStore';
import {
  currencySelector
} from '@src/store/setting/selectors';
import React from 'react';
import Swipeout from 'react-native-swipeout';
import BtnDelete from '../Button/BtnDelete';
import withToken from './Token.enhance';
import { styled } from './Token.styled';
import { Amount } from './TokenAmount';
import { AmountBasePRV } from './TokenAmountBasePRV';
import { AmountBaseUSDT } from './TokenAmountBaseUSDT';
import { Name } from './TokenName';
import { Price } from './TokenPrice';


const TokenPairPRV = props => (
  <TouchableOpacity onPress={props?.onPress}>
    <View style={[styled.container, props?.style]}>
      <View style={[styled.extra, styled.extraTop]}>
        <Name {...props} />
        <Amount {...props} />
      </View>
      <View style={styled.extra}>
        <Price {...props} />
        <AmountBasePRV {...props} />
      </View>
    </View>
  </TouchableOpacity>
);

const TokenDefault = props => (
  <TouchableOpacity onPress={props?.onPress}>
    <View style={[styled.container, props?.style]}>
      <View style={styled.extra}>
        <Name {...props} />
        <Amount {...{...props, customStyle: styled.boldText}} />
      </View>
    </View>
  </TouchableOpacity>
);

const TokenPairUSDT = props => (
  <TouchableOpacity onPress={props?.onPress}>
    <View style={[styled.container, props?.style]}>
      <View style={[styled.extra, styled.extraTop]}>
        <Name {...props} />
        <Amount {...props} />
      </View>
      <View style={styled.extra}>
        <Price {...props} />
        <AmountBaseUSDT {...props} />
      </View>
    </View>
  </TouchableOpacity>
);

const Token = props => {
  const {handleRemoveToken = null, swipable = false, pricePrv, isPRV} = props;
  const isToggleUSD = useSelector(currencySelector);
  let TokenComponent;
  if (isToggleUSD) {
    TokenComponent = <TokenPairUSDT {...props} />;
  } else {
    const pairWithPRV = pricePrv !== 0 && !isPRV;
    TokenComponent = pairWithPRV ? (
      <TokenPairPRV {...props} />
    ) : (
      <TokenDefault {...props} />
    );
  }

  if (swipable === true) {
    return (
      <Swipeout
        autoClose
        style={{
          backgroundColor: 'transparent',
        }}
        right={[
          {
            component: (
              <BtnDelete
                showIcon={false}
                onPress={
                  typeof handleRemoveToken === 'function'
                    ? handleRemoveToken
                    : null
                }
              />
            ),
          },
        ]}>
        {TokenComponent}
      </Swipeout>
    );
  }
  return TokenComponent;
};

// Token.defaultProps = {
//   displayName: 'Incognito Token',
//   amount: 0,
//   onPress: null,
//   symbol: null,
//   isGettingBalance: false,
//   style: null,
//   pDecimals: null,
//   isVerified: false,
//   iconUrl: null,
//   amountInPRV: 0,
//   price: 0,
//   percentChange: 0,
//   pricePrv: 0,
// };

// Token.propTypes = {
//   pDecimals: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   displayName: PropTypes.string,
//   amount: PropTypes.number,
//   onPress: PropTypes.func,
//   symbol: PropTypes.string,
//   isGettingBalance: PropTypes.bool,
//   style: PropTypes.any,
//   isVerified: PropTypes.bool,
//   iconUrl: PropTypes.string,
//   amountInPRV: PropTypes.number,
//   price: PropTypes.number,
//   percentChange: PropTypes.number,
//   pricePrv: PropTypes.number,
//   swipable: PropTypes.bool,
//   removable: PropTypes.bool,
//   handleRemoveToken: PropTypes.func,
// };

export default withToken(React.memo(Token));
