import ActivityIndicator from '@src/components/core/ActivityIndicator';
import {AccountIcon} from '@src/components/Icons';
import {ExHandler} from '@src/services/exception';
import ToastService from '@src/services/ToastService';
import {
  actionLoadAllBalance,
  actionSwitchAccount,
} from '@src/store/account/functions';
import {isGettingBalance, listAccount} from '@src/store/account/selectors';
import {useSelector} from '@src/store/getStore';
import {actionToggleModal} from '@src/store/modal/functions';
import {getPrivacyDataBaseOnAccount} from '@src/store/selectedPrivacy/selectors';
import {COLORS, FONTS} from '@src/styles';
import format from '@src/utils/format';
import React, {useEffect} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const srcAccountIcon = require('../../../assets/images/icons/account_staking_pool.png');

interface IAccountProps {
  account: any;
  lastChild: boolean;
  isLoadingBalance: boolean;
  onSelectAccount: (account: any) => void;
}

const Account = (props: IAccountProps) => {
  const {account, lastChild, isLoadingBalance, onSelectAccount} = props;
  const selectedPrivacy = useSelector(getPrivacyDataBaseOnAccount)(account);
  const {symbol, pDecimals, amount} = selectedPrivacy || {
    symbol: '',
    pDecimals: 0,
    amount: 0,
  };
  const shouldShowBalance = true;
  const onChooseAccount = async name => {
    try {
      if (isLoadingBalance) {
        return;
      }
      onSelectAccount && onSelectAccount(account);
      await actionSwitchAccount(name);
      await actionToggleModal();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const renderBalance = () => {
    if (isLoadingBalance) {
      return <ActivityIndicator size="small" />;
    }
    if (shouldShowBalance) {
      return (
        <View style={styled.balanceContainer}>
          <Text style={styled.accountBalance} numberOfLines={1}>
            {`${format.amount(amount, pDecimals)}`}
          </Text>
          <Text style={styled.accountBalance}>{symbol}</Text>
        </View>
      );
    }
    return null;
  };
  return (
    <TouchableOpacity onPress={() => onChooseAccount(account?.name)}>
      <View style={[styled.account, lastChild ? styled.lastChild : null]}>
        <AccountIcon source={srcAccountIcon} style={styled.icon} />
        <Text style={styled.accountName} numberOfLines={1}>
          {account?.name || account?.AccountName}
        </Text>
        {renderBalance()}
      </View>
    </TouchableOpacity>
  );
};

interface IChooseAccountProps {
  onSelectAccount: (account: any) => void;
}

const ChooseAccount = (props: IChooseAccountProps) => {
  const {onSelectAccount} = props;
  const accountList = useSelector(state => listAccount(state));
  const isGettingBalances = useSelector(state => isGettingBalance(state)) || [];
  const refreshing =
    Array.isArray(isGettingBalance) && isGettingBalances.length > 0;

  const fetchData = async () => {
    try {
      await actionLoadAllBalance();
    } catch (error) {
      ToastService.showError(
        'This seems to be taking longer than usual. Please try again later.',
        true,
        true,
        'error',
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styled.accountContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }>
        {accountList.map((account, index) => (
          <Account
            isLoadingBalance={isGettingBalances.includes(
              account?.name || account?.AccountName,
            )}
            onSelectAccount={onSelectAccount}
            account={account}
            key={account?.name || account?.AccountName}
            lastChild={accountList.length - 1 === index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ChooseAccount;

const styled = StyleSheet.create({
  accountContainer: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: '50%',
    minHeight: '40%',
  },
  account: {
    flexDirection: 'row',
    padding: 20,
    borderBottomColor: COLORS.lightGrey1,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  accountName: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    color: COLORS.black,
    marginLeft: 20,
    maxWidth: '100%',
    textAlign: 'left',
    flex: 1,
  },
  accountBalance: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    textAlign: 'right',
    maxWidth: 100,
    marginLeft: 5,
  },
  lastChild: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomColor: 'transparent',
  },
  icon: {
    width: 20,
    height: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
});
