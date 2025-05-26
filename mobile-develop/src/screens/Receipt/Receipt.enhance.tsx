import {CONSTANT_COMMONS, CONSTANT_CONFIGS} from '@src/constants';
import {useNavigationParam} from '@src/hooks';
import {
  navigateToFrequentReceiversForm,
  navigateToWalletDetail,
} from '@src/router/NavigationServices';
import {ExHandler} from '@src/services/exception';
import {useSelector} from '@src/store/getStore';
import {receiversSelector} from '@src/store/receivers/selectors';
import formatUtil from '@src/utils/format';
import React from 'react';
import {useBtnSaveReceiver} from '../FrequentReceivers';

const enhance = WrappedComp => props => {
  const params = useNavigationParam('params', {}) || {};
  const {
    toAddress = '',
    lockTime = 0,
    pDecimals = CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY,
    originalAmount = 0,
    fee = 0,
    feeUnit = '',
    tokenSymbol = '',
    keySaveAddressBook = '',
    txId = '',
    title = '',
    onGoBack,
  } = params || props;
  const {receivers} = useSelector(receiversSelector)[keySaveAddressBook];
  const time = formatUtil.formatDateTime(lockTime * 1000);
  const amount = `${formatUtil.amount(
    originalAmount,
    pDecimals,
  )} ${tokenSymbol}`;
  const infoFactories = [
    {
      label: 'To',
      desc: toAddress,
      disabled: !toAddress,
    },
    {
      label: 'Time',
      desc: time,
      disabled: !lockTime,
    },
    {
      label: 'Amount',
      desc: amount,
      disabled: !amount,
    },
    {
      label: 'Fee',
      desc: `${fee} ${feeUnit}`,
      disabled: !fee,
    },
    {
      label: 'TxID',
      desc: `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txId}`,
      disabled: !txId,
      renderTx: true,
    },
  ];

  const onBack = async () =>
    typeof onGoBack === 'function' ? onGoBack() : navigateToWalletDetail();

  const onSaveReceivers = async () => {
    try {
      navigateToFrequentReceiversForm({
        info: {
          address: toAddress,
        },
        keySave: keySaveAddressBook,
        headerTitle: 'Save address',
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const [btnSaveReceiver] = useBtnSaveReceiver({
    onSaveReceivers,
    receivers,
    toAddress,
    keySave: keySaveAddressBook,
  });
  return (
    <WrappedComp
      {...{
        ...props,
        title,
        onBack,
        infoFactories,
        btnSaveReceiver,
      }}
    />
  );
};

export default enhance;
