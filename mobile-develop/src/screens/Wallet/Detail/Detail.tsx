import {View} from '@src/components/core';
import {View2} from '@src/components/core/View';
import globalStyled from '@src/theme/theme.styled';
import React from 'react';
import {SafeAreaView, TouchableOpacity} from 'react-native';

import {BtnPrimary, BtnSecondary} from '@components/core/Button';
import IconEye from '@components/Icons/icon.eye';
import BtnInfo from '@src/components/Button/BtnInfo';
import Header from '@src/components/Header/Header';
import withLazy from '@src/components/LazyHoc/withLazy';
import {Amount} from '@src/components/Token/TokenAmount';
import {ChangePrice} from '@src/components/Token/TokenChangePrice';
import {Price} from '@src/components/Token/TokenPrice';
import {CONSTANT_APP} from '@src/constants';
import {useNavigationParam} from '@src/hooks';
import {
  navigateToReceiveCrypto,
  navigateToSend,
  navigateToWallet,
} from '@src/router/NavigationServices';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import useFeatureConfig from '@src/shared/hooks/useFeatureConfig';
import {
  defaultAccountSelector,
  isGettingBalance as isGettingMainCryptoBalanceSelector,
} from '@src/store/account/selectors';
import {followTokenItemSelector} from '@src/store/followList/selectors';
import {actionToggleModal} from '@src/store/modal/functions';
import {
  selectedPrivacy,
  selectedPrivacyByFollowedSelector,
  selectedPrivacy as selectedPrivacySelector,
} from '@src/store/selectedPrivacy/selectors';
import {actionUpdateShowWalletBalance} from '@src/store/setting';
import {hideWalletBalanceSelector} from '@src/store/setting/selectors';
import {isGettingBalance as isGettingBalanceSharedSelector} from '@src/store/shared/selectors';
import {
  historyTokenSelector,
  isGettingBalance as isGettingTokenBalanceSelector,
} from '@src/store/token/selectors';
import {useTheme} from 'styled-components/native';
import {useHistoryEffect} from '../History';
import HistoryToken from '../HistoryToken';
import MainCryptoHistory from '../MainCryptoHistory';
import {balanceStyled, groupBtnStyled, historyStyled} from './Detail.styled';

const GroupButton = React.memo(() => {
  const handleSend = () => {
    navigateToSend();
    actionToggleModal({visible: false});
  };
  const handleReceive = () => {
    navigateToReceiveCrypto();
    actionToggleModal({visible: false});
  };
  const [onPressSend, isSendDisabled] = useFeatureConfig(
    CONSTANT_APP.DISABLED.SEND,
    handleSend,
  );

  return (
    <SafeAreaView>
      <View2
        style={[
          groupBtnStyled.groupButton,
          {...globalStyled.defaultPaddingHorizontal},
        ]}>
        <BtnSecondary
          title="Receive"
          wrapperStyle={groupBtnStyled.btnStyle}
          onPress={handleReceive}
        />
        <BtnPrimary
          title="Send"
          wrapperStyle={groupBtnStyled.btnStyle}
          onPress={onPressSend}
        />
      </View2>
    </SafeAreaView>
  );
});

const Balance = React.memo(() => {
  const selected = useDebounceSelector(selectedPrivacy);
  const tokenID = useNavigationParam('tokenId', '');
  const token = useDebounceSelector(followTokenItemSelector)(tokenID);
  const theme = useTheme();
  const isGettingBalance = useDebounceSelector(
    isGettingBalanceSharedSelector,
  ).includes(selected?.tokenId);
  const tokenData = {
    ...selected,
    isGettingBalance,
  };
  const hideBalance = useDebounceSelector(hideWalletBalanceSelector);
  const toggleHideBalance = () => actionUpdateShowWalletBalance();

  const amountProps = {
    customStyle: balanceStyled.amount,
    ...tokenData,
    showSymbol: false,
  };
  const changePriceProps = {
    customStyle: balanceStyled.changePrice,
    ...tokenData,
  };
  return (
    <View style={balanceStyled.container}>
      <TouchableOpacity
        style={balanceStyled.btnToggleBalance}
        activeOpacity={1}
        onPress={toggleHideBalance}>
        <Amount
          {...amountProps}
          amount={token?.amount}
          hideBalance={hideBalance}
          fromBalance
        />
        <View style={balanceStyled.btnHideBalance}>
          <IconEye hideEye={!hideBalance} />
        </View>
      </TouchableOpacity>
      <View style={balanceStyled.hook}>
        <Price
          pricePrv={selected?.pricePrv}
          priceUsd={selected?.priceUsd}
          textStyle={{color: theme.text3}}
        />
        <ChangePrice {...changePriceProps} />
      </View>
    </View>
  );
});

const History = React.memo(() => {
  const selectedPrivacy = useDebounceSelector(selectedPrivacySelector);
  const [page, setPage] = React.useState(15);

  const onLoadmoreHistory = React.useCallback(() => {
    setPage(page => page + 15);
  }, []);

  return (
    <View style={[historyStyled.container, {marginTop: 12}]}>
      {selectedPrivacy?.isMainCrypto ? (
        <MainCryptoHistory page={page} onLoadmoreHistory={onLoadmoreHistory} />
      ) : (
        <HistoryToken page={page} onLoadmoreHistory={onLoadmoreHistory} />
      )}
    </View>
  );
});

const Detail = props => {
  const selected = useDebounceSelector(selectedPrivacySelector);
  const {isFetching} = useDebounceSelector(historyTokenSelector);
  const token = useDebounceSelector(selectedPrivacyByFollowedSelector);
  const isGettingTokenBalance = useDebounceSelector(
    isGettingTokenBalanceSelector,
  );
  const isGettingMainCryptoBalance = useDebounceSelector(
    isGettingMainCryptoBalanceSelector,
  );
  const defaultAccount = useDebounceSelector(defaultAccountSelector);
  const refreshing =
    !!isFetching || selected?.isMainCrypto
      ? isGettingMainCryptoBalance.length > 0 || !defaultAccount
      : isGettingTokenBalance.length > 0 || !token;
  const onGoBack = () => navigateToWallet();
  const {onRefresh} = useHistoryEffect();
  return (
    <View2 fullFlex>
      <Header
        title={selected?.name}
        customHeaderTitle={<BtnInfo />}
        // rightHeader={<CustomRightHeader />}
        onGoBack={onGoBack}
        handleSelectedAccount={onRefresh}
      />
      <View borderTop fullFlex>
        <View borderTop paddingHorizontal style={{paddingBottom: 0}}>
          <Balance />
        </View>
        <History {...{...props, refreshing}} />
      </View>
      <GroupButton />
    </View2>
  );
};
export default withLazy(React.memo(Detail));
