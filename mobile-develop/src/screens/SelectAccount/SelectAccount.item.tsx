import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {Text, Text3, TouchableOpacity} from '@src/components/core';
import {ExHandler} from '@src/services/exception';
import debounce from 'lodash/debounce';
import {RatioIcon} from '@components/Icons';
import styled from 'styled-components/native';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import ModalSwitchingAccount from './SelectAccount.modalSwitching';
import {FONTS} from '@src/styles';
import {Row} from '@src/components/Row';
import {useNavigationParam} from '@src/hooks';
import {
  defaultAccount,
  switchAccountSelector,
} from '@src/store/account/selectors';
import {
  actionSwitchAccountFetched,
  actionSwitchAccountFetching,
} from '@src/store/account/functions';
import {actionToggleModal} from '@src/store/modal/functions';
import ToastService from '@src/services/ToastService';
import {switchMasterKey} from '@src/store/masterKey/functions';
import {goBack} from '@src/router/NavigationServices';

const itemStyled = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  selected: {},
  container: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 9,
  },
  address: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    marginTop: 4,
  },
});

const CustomRow = styled(Row)`
  border: 1px solid ${({theme}) => theme.border1};
`;

interface AccountItemProps {
  accountName: string;
  PrivateKey: string;
  PaymentAddress: string;
  MasterKeyName: string;
  handleSelectedAccount: () => void;
}

const AccountItem = React.memo(
  ({
    accountName,
    PrivateKey,
    PaymentAddress,
    MasterKeyName,
    handleSelectedAccount,
  }: AccountItemProps) => {
    const dispatch = useDispatch();
    const onSelect = useNavigationParam('onSelect', () => {});
    const account = useDebounceSelector(defaultAccount);
    const switchingAccount = useDebounceSelector(switchAccountSelector);
    if (!accountName) {
      return null;
    }
    const onSelectAccount = async () => {
      try {
        if (switchingAccount) {
          return;
        }
        await actionSwitchAccountFetching();
        await dispatch(
          actionToggleModal({
            visible: true,
            data: <ModalSwitchingAccount />,
          }),
        );
        if (PrivateKey === account?.PrivateKey) {
          ToastService.show(`Your current account is "${accountName}"`);
          return;
        }
        await switchMasterKey(MasterKeyName, accountName);
      } catch (e) {
        new ExHandler(
          e,
          `Can not switch to account "${accountName}", please try again.`,
        ).showErrorToast();
      } finally {
        await actionSwitchAccountFetched();
        actionToggleModal();
        if (typeof handleSelectedAccount === 'function') {
          handleSelectedAccount();
        }
        if (!onSelect) {
          goBack();
        } else {
          onSelect();
        }
      }
    };

    const isCurrentAccount = useMemo(
      () => PrivateKey === account?.PrivateKey,
      [PrivateKey, account?.PrivateKey],
    );

    const Component = ({style}: {style?: any}) => (
      <CustomRow style={[itemStyled.wrapper, style]}>
        <View style={itemStyled.container}>
          <Row centerVertical spaceBetween>
            <Text style={itemStyled.name} numberOfLines={1}>
              {accountName}
            </Text>
            <RatioIcon selected={isCurrentAccount} />
          </Row>
          <Text3
            style={itemStyled.address}
            numberOfLines={1}
            ellipsizeMode="middle">
            {PaymentAddress}
          </Text3>
        </View>
      </CustomRow>
    );

    if (!switchingAccount) {
      return (
        <TouchableOpacity onPress={debounce(onSelectAccount, 100)}>
          <Component style={[isCurrentAccount ? itemStyled.selected : null]} />
        </TouchableOpacity>
      );
    }

    return <Component />;
  },
);

export default AccountItem;
