import accountService from '@services/wallet/accountService';
import toLower from 'lodash/toLower';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import styled, {useTheme} from 'styled-components/native';

import useDebounceSelector from '@src/hooks/useDebounceSelector';
import {navigateToSelectAccount} from '@src/router/NavigationServices';
import {
  defaultAccountNameSelector,
  defaultAccountSelector,
} from '@src/store/account/selectors';
import {switchMasterKey} from '@src/store/masterKey/functions';
import {
  currentMasterKeySelector,
  listAllMasterKeyAccounts,
} from '@src/store/masterKey/selectors';
import {FONTS} from '@src/styles';
import {isIOS} from '@src/utils';
import {Text, TouchableOpacity} from './core';
import { actionChangeTab } from '@src/store/tabs/functions';

const styles = StyleSheet.create({
  btnStyle: {
    width: 78,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  accountName: {
    ...FONTS.TEXT.incognitoP2,
    fontFamily: FONTS.NAME.medium,
    lineHeight: isIOS() ? 20 : 24,
  },
});

const CustomTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({theme}) => theme.black1};
`;

const SelectAccountButton = ({
  ignoredAccounts = [],
  disabled,
  handleSelectedAccount,
}: {
  ignoredAccounts?: string[];
  disabled?: boolean;
  handleSelectedAccount?: () => void;
}) => {
  const theme = useTheme();
  const account = useDebounceSelector(defaultAccountSelector);
  const masterkey = useDebounceSelector(currentMasterKeySelector);
  const defaultAccountName = useDebounceSelector(defaultAccountNameSelector);
  const accounts = useDebounceSelector(listAllMasterKeyAccounts);
  const onChangDefaultTab = React.useCallback(() => {
    const isMasterless = masterkey?.isMasterless;

    //TODO
    // actionChangeTab({
    //   rootTabID: TABS.TAB_SELECT_ACCOUNT_ID,
    //   tabID: isMasterless
    //     ? TABS.TAB_SELECT_ACCOUNT_MASTER_LESS_ID
    //     : TABS.TAB_SELECT_ACCOUNT_MASTER_KEY_ID,
    // });
  }, [masterkey]);
  const onNavSelectAccount = () => {
    if (disabled) return;
    onChangDefaultTab();
    navigateToSelectAccount({
      ignoredAccounts,
      handleSelectedAccount,
    });
  };
  const checkAccount = async () => {
    try {
      if (ignoredAccounts.includes(toLower(account?.name))) {
        const accountNames = accounts.map(item => item.accountName);
        const validAccounts = accountNames.filter(
          name => !ignoredAccounts.includes(toLower(name)),
        );
        if (validAccounts && validAccounts.length) {
          await switchMasterKey(
            validAccounts[0].MasterKeyName,
            accountService.getAccountName(validAccounts[0]),
          );
        }
      }
    } catch (error) {
      console.log('CHECK ACCOUNT ERROR', error);
    }
  };
  useEffect(() => {
    checkAccount();
  }, []);
  return (
    <CustomTouchableOpacity
      disabled={disabled}
      onPress={onNavSelectAccount}
      style={[styles.btnStyle, {borderColor: theme.against, borderWidth: 1}]}>
      <Text style={[styles.accountName]} numberOfLines={1} ellipsizeMode="tail">
        {defaultAccountName}
      </Text>
    </CustomTouchableOpacity>
  );
};

export default SelectAccountButton;
