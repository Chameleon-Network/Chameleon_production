import React, {memo, useCallback} from 'react';

import {View} from '@components/core';
import {BtnPrimary} from '@components/core/Button';
import {Text3} from '@components/core/Text';
import IconEye from '@components/Icons/icon.eye';
import {PRV} from '@services/wallet/tokenService';
import {Row} from '@src/components/Row';
import {CONSTANT_APP} from '@src/constants';
import {navigateToShield} from '@src/router/NavigationServices';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import useFeatureConfig from '@src/shared/hooks/useFeatureConfig';
import {useSelector} from '@src/store/getStore';
import {actionUpdateShowWalletBalance} from '@src/store/setting';
import {hideWalletBalanceSelector} from '@src/store/setting/selectors';
import {
  isGettingBalance as isGettingTotalBalanceSelector,
  totalShieldedTokensSelector,
} from '@src/store/shared/selectors';
import {actionToggleGuide} from '@src/store/shield/functions';
import {shieldStorageSelector} from '@src/store/shield/selectors';
import globalStyled from '@src/theme/theme.styled'; 
import isNaN from 'lodash/isNaN';
import {TouchableOpacity} from 'react-native';
import WalletAddToken from './Wallet.addToken';
import {groupButtonStyled, styledBalance} from './Wallet.styled';
import { Amount } from '@src/components/Token/TokenAmount';

const Balance = React.memo(({hideBalance}: {hideBalance: boolean}) => {
  let totalShielded = useDebounceSelector(totalShieldedTokensSelector);
  const isGettingTotalBalance = useSelector(isGettingTotalBalanceSelector).length > 0;
  if (isNaN(totalShielded)) {
    totalShielded = 0;
  }

  console.log('totalShielded', totalShielded);
  return (
    <View style={[styledBalance.container]}>
      <Row centerVertical spaceBetween>
        <Text3 style={styledBalance.title}>Shielded balance</Text3>
        <WalletAddToken />
      </Row>
      <Row style={styledBalance.wrapBalance} center>
        <TouchableOpacity
          style={styledBalance.wrapperAmount}
          onPress={actionUpdateShowWalletBalance}
          activeOpacity={1}>
          <Amount
            amount={totalShielded}
            pDecimals={PRV.pDecimals}
            showSymbol={false}
            isGettingBalance={isGettingTotalBalance}
            customStyle={styledBalance.balance}
            hasPSymbol
            stylePSymbol={styledBalance.pSymbol}
            containerStyle={styledBalance.balanceContainer}
            ellipsizeMode="clip"
            size="large"
            hideBalance={hideBalance}
            fromBalance
          />
          <View style={styledBalance.btnHideBalance}>
            <IconEye hideEye={!hideBalance} />
          </View>
        </TouchableOpacity>
      </Row>
    </View>
  );
});

const GroupButton = React.memo(() => {
  const {guide} = useSelector(shieldStorageSelector);
  const handleShield = async () => {
    if (isDisabled) return;
    navigateToShield();
    if (!guide) {
      await actionToggleGuide();
    }
  };
  const [onFeaturePress, isDisabled] = useFeatureConfig(
    CONSTANT_APP.DISABLED.SHIELD,
    handleShield,
  );
  return (
    <View style={groupButtonStyled.container}>
      <BtnPrimary onPress={onFeaturePress} title="Shield a coin" />
    </View>
  );
});

const WalletExtra = () => {
  const hideBalance = useSelector(hideWalletBalanceSelector);
  return (
    <View borderTop style={[globalStyled.defaultPaddingHorizontal]}>
      <Balance hideBalance={hideBalance} />
      <GroupButton />
    </View>
  );
};

export default memo(WalletExtra);
