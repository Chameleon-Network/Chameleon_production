import {DeleteFillIcon} from '@components/Icons/icon.delete';
import ImageCached from '@src/components/ImageCached';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {
  currencySelector,
  hideWalletBalanceSelector,
} from '@src/store/setting/selectors';
import {COLORS, FONTS} from '@src/styles';
import {formatAmount, formatPrice} from '@src/utils/token';
import format from '@utils/format';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import replace from 'lodash/replace';
import round from 'lodash/round';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'styled-components/native';
import {withToken} from './Wallet.enhance';
import {tokenStyled} from './Wallet.styled';
import {Row} from '@src/components/Row';
import {NormalText} from '@src/components/core/NormalText/NormalText';
import {styles} from '@src/components/Token/TokenFollow';
import { itemStyled } from '@src/screens/Setting/Keychain/keychain.styled';
import Swipeout from 'react-native-swipeout';

const incognitoSrc = require('../../../assets/images/new-icons/incognito.png');

interface ITokenProps {
  pDecimals: number | string;
  displayName: string;
  amount: number;
  onPress: () => void;
  symbol: string;
  isGettingBalance: boolean;
  style: any;
  isVerified: boolean;
  iconUrl: string;
  amountInPRV: number;
  price: number;
  percentChange: number;
  pricePrv: number;
  swipable: boolean;
  handleRemoveToken: () => void;
}

interface ITokenDefaultProps extends ITokenProps {
  symbol: string;
  priceUsd: number;
  amount: number;
  pDecimals: string;
  decimalDigits: string;
  pricePrv: number;
  change: string;
  onPress: () => void;
  isGettingBalance: boolean;
  showGettingBalance: boolean;
  iconUrl: string;
  shortName: string;
  networkName: string;
  tokenId: string;
  network: string;
}

const TokenDefault = React.memo((props: ITokenDefaultProps) => {
  const {
    symbol,
    priceUsd,
    pDecimals,
    decimalDigits,
    pricePrv = 0,
    change,
    onPress,
    shortName,
    isGettingBalance,
    showGettingBalance,
    iconUrl,
    amount = 0,
    networkName,
    tokenId,
    network,
  } = props;
  const theme = useTheme();
  const shouldShowGettingBalance = isGettingBalance || showGettingBalance;
  const isToggleUSD = useDebounceSelector(currencySelector);
  const hideBalance = useDebounceSelector(hideWalletBalanceSelector);
  const balance = React.useMemo(() => {
    const price = isToggleUSD ? priceUsd : pricePrv;
    const amountCompare = formatAmount(
      price,
      amount,
      pDecimals,
      pDecimals,
      decimalDigits,
      false,
    );
    const tokenAmount = format.amountVer2(amount, pDecimals);
    const isTokenDecrease = change[0] === '-';
    const changeToNumber = Number(replace(change, '-', ''));
    const changeStr =
      changeToNumber === 0
        ? ''
        : `${isTokenDecrease ? '-' : '+'}${round(changeToNumber, 2)}%`;
    const changeColor = isTokenDecrease ? COLORS.red2 : COLORS.green;
    return {
      amountCompare,
      price: formatPrice(price),
      tokenAmount,
      changeStr,
      changeColor,
    };
  }, [priceUsd, pricePrv, amount, isToggleUSD]);

  return (
    <TouchableOpacity style={tokenStyled.container} onPress={onPress}>
      <ImageCached
        style={tokenStyled.icon}
        uri={iconUrl}
        defaultImage={incognitoSrc}
      />
      <View style={tokenStyled.wrapFirst}>
        <NormalText style={tokenStyled.mainText} text={symbol} />
        <Row>
          <NormalText
            text={shortName}
            style={[tokenStyled.grayText, {color: theme.text3}]}
          />
          {!!network && tokenId !== PRVIDSTR && (
            <NormalText
              style={[
                styles.networkLabel,
                {backgroundColor: theme.background3, color: theme.grey1},
              ]}
              text={network}
            />
          )}
        </Row>
      </View>
      <View style={tokenStyled.wrapSecond}>
        {shouldShowGettingBalance ? (
          <View style={tokenStyled.wrapLoader}>
            <ActivityIndicator />
          </View>
        ) : (
          <NormalText
            text={balance.amountCompare}
            hasPSymbol
            style={tokenStyled.mainText}
            stylePSymbol={[
              tokenStyled.mainText,
              {fontFamily: FONTS.NAME.specialRegular},
            ]}
            showBalance={!hideBalance}
          />
        )}
        <NormalText
          text={`${balance.tokenAmount} ${symbol}`}
          style={[tokenStyled.grayText, {color: theme.text3}]}
          showBalance={!hideBalance}
          symbol={symbol}
        />
      </View>
    </TouchableOpacity>
  );
});

const Token = (props: ITokenProps) => {
  const {handleRemoveToken, swipable} = props;
  const theme = useTheme();
  if (swipable === true) {
    return (
      <Swipeout
        autoClose
        style={{
          ...itemStyled.swipeout,
          borderBottomColor: theme.border4,
        }}
        right={[
          {
            component: (
              <View style={itemStyled.wrapBin}>
                <DeleteFillIcon />
              </View>
            ),
            onPress: handleRemoveToken,
          },
        ]}>
        <TokenDefault {...props} />
      </Swipeout>
    );
  }
  return (
    <View
      style={{
        ...itemStyled.swipeout,
        borderBottomColor: theme.border4,
      }}>
      <TokenDefault {...props} />
    </View>
  );
};

export default withToken(memo(Token));
