import {useFocusEffect} from '@react-navigation/native';
import accountService from '@services/wallet/accountService';
import {useSearchBox} from '@src/components/Header';
import {CONSTANT_COMMONS, CONSTANT_KEYS} from '@src/constants';
import {useNavigationParam} from '@src/hooks';
import {defaultAccountSelector} from '@src/store/account/selectors';
import {listAllMasterKeyAccounts} from '@src/store/masterKey/selectors';
import {actionRemoveSelectedReceiver} from '@src/store/receivers/functions';
import {receiversSelector} from '@src/store/receivers/selectors';
import {selectedPrivacy as selectedPrivacySelector} from '@src/store/selectedPrivacy/selectors';
import {isIOS} from '@src/utils/platform';
import {forEach, groupBy} from 'lodash';
import React, {useMemo} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {useSelector} from 'react-redux';
import {filterAddressByKey} from './FrequentReceivers.utils';

const enhance = WrappedComp => props => {
  const selectedPrivacy = useSelector(selectedPrivacySelector);
  const accounts = useSelector(listAllMasterKeyAccounts);
  const defaultAccount = useSelector(defaultAccountSelector);
  const filterBySelectedPrivacy = !!useNavigationParam(
    'filterBySelectedPrivacy',
  );
  const {receivers: incognitoAddress} =
    useSelector(receiversSelector)[
      CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK
    ];
  const {receivers: externalAddress} =
    useSelector(receiversSelector)[
      CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK
    ];
  const incognitoAddresses = incognitoAddress.filter(
    item => item?.address !== defaultAccount?.paymentAddress,
  );
  const extAddrFilBySelPrivacy = [
    ...externalAddress.filter(item =>
      filterBySelectedPrivacy
        ? item?.rootNetworkName === selectedPrivacy?.rootNetworkName ||
          (CONSTANT_COMMONS.FACTORIES_EVM_NETWORK.includes(
            item?.rootNetworkName,
          ) &&
            CONSTANT_COMMONS.FACTORIES_EVM_NETWORK.includes(
              selectedPrivacy?.rootNetworkName,
            ))
        : true,
    ),
  ];

  // eslint-disable-next-line no-unused-vars
  const [_, keySearch] = useSearchBox({
    data: [],
    handleFilter: () => filterAddressByKey([], keySearch),
  });

  const accountGroupByMasterKey = useMemo(
    () => groupBy(accounts, item => item.MasterKeyName),
    [accounts],
  );

  const receivers = [];
  forEach(accountGroupByMasterKey, (accounts, masterKeyName) => {
    const keychainsAddresses = accounts
      .filter(
        account =>
          accountService.getPaymentAddress(account) !==
          accountService.getPaymentAddress(defaultAccount),
      )
      .map(item => ({
        name: accountService.getAccountName(item),
        address: accountService.getPaymentAddress(item),
      }));
    const [_keychainsAddresses] = useSearchBox({
      data: keychainsAddresses,
      handleFilter: () => filterAddressByKey(keychainsAddresses, keySearch),
    });

    if (_keychainsAddresses.length > 0) {
      receivers.push({
        data: _keychainsAddresses,
        label: masterKeyName,
        keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK,
      });
    }
  });

  const [_incognitoAddress] = useSearchBox({
    data: incognitoAddresses,
    handleFilter: () => filterAddressByKey(incognitoAddress, keySearch),
  });
  const [_externalAddress] = useSearchBox({
    data: extAddrFilBySelPrivacy,
    handleFilter: () => filterAddressByKey(extAddrFilBySelPrivacy, keySearch),
  });

  receivers.push(
    ...[
      {
        data: _incognitoAddress,
        label: 'Incognito addresses',
        keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK,
      },
      {
        data: _externalAddress,
        label: 'External addresses',
        keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK,
      },
    ],
  );

  useFocusEffect(
    React.useCallback(() => {
      actionRemoveSelectedReceiver();
    }, []),
  );

  const isEmpty = receivers.length === 0;
  const isPlatformIOS = isIOS();
  const Wrapper = isPlatformIOS ? KeyboardAvoidingView : View;
  return (
    <ErrorBoundary>
      <WrappedComp {...{...props, Wrapper, isEmpty, receivers}} />
    </ErrorBoundary>
  );
};

export default enhance;
