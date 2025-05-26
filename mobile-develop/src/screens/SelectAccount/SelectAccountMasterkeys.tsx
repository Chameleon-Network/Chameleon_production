import GroupItem from '@screens/SelectAccount/SelectAccount.groupItem';
import AccountItem from '@screens/SelectAccount/SelectAccount.item';
import {RefreshControl} from '@src/components/core';
import {useNavigationParam} from '@src/hooks';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {defaultAccount} from '@src/store/account/selectors';
import {loadAllMasterKeyAccounts} from '@src/store/masterKey/functions';
import {
  groupMasterKeys,
  isLoadingAllMasterKeyAccountSelector,
} from '@src/store/masterKey/selectors';
import React, {memo, useCallback} from 'react';
import {ScrollView} from 'react-native';

const SelectAccountMasterKeys = () => {
  const groupAccounts = useDebounceSelector(groupMasterKeys);
  const loading = useDebounceSelector(isLoadingAllMasterKeyAccountSelector);
  const account = useDebounceSelector(defaultAccount);
  const handleSelectedAccount = useNavigationParam('handleSelectedAccount', '');
  const handleLoadAllMasterKeyAccounts = useCallback(
    () => loadAllMasterKeyAccounts(),
    [],
  );
  const renderItem = useCallback(
    (account: any) => (
      <AccountItem
        key={account?.ValidatorKey}
        accountName={account.AccountName}
        PaymentAddress={account.PaymentAddress}
        PrivateKey={account.PrivateKey}
        MasterKeyName={account.MasterKeyName}
        handleSelectedAccount={handleSelectedAccount}
      />
    ),
    [],
  );

  const renderGroupAccounts = React.useCallback(
    (item, index) => {
      const isDefaultExpand = (item.child || []).some(({OTAKey}) => {
        return OTAKey === account.OTAKey;
      });
      return (
        <GroupItem
          name={item.name}
          key={item.name}
          isDefaultExpand={isDefaultExpand}
          isLast={index === groupAccounts.length - 1}
          child={item.child.map(renderItem)}
        />
      );
    },
    [account.OTAKey],
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleLoadAllMasterKeyAccounts}
        />
      }
      contentContainerStyle={{paddingHorizontal: 25}}>
      {groupAccounts.map(renderGroupAccounts)}
    </ScrollView>
  );
};

export default memo(SelectAccountMasterKeys);
