import accountService from '@services/wallet/accountService';
import ButtonBasic from '@src/components/Button/ButtonBasic';
import {CONSTANT_KEYS} from '@src/constants';
import {ExHandler} from '@src/services/exception';
import {listAllMasterKeyAccounts} from '@src/store/masterKey/selectors';
import {FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const styleSheet = StyleSheet.create({
  btnSaveReceivers: {
    marginTop: 50,
    width: '100%',
  },
  titleReceivers: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 3,
  },
});

interface Props {
  onSaveReceivers: () => void;
  receivers: any[];
  toAddress: string;
  keySave: string;
}

export const useBtnSaveReceiver = (props: Props) => {
  const {onSaveReceivers, receivers, toAddress, keySave} = props;
  const accounts = useSelector(listAllMasterKeyAccounts);
  const [btnSave, setBtnSave] = React.useState(null);
  const isExisted =
    receivers.some(item => item?.address === toAddress) ||
    (keySave === CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK &&
      accounts?.some(
        account => accountService.getPaymentAddress(account) === toAddress,
      ));
  React.useEffect(() => {
    renderBtnSaveReceiver();
    return () => {
      renderBtnSaveReceiver();
    };
  }, []);
  const renderBtnSaveReceiver = async () => {
    try {
      if (!isExisted) {
        await setBtnSave(
          <ButtonBasic
            btnStyle={styleSheet.btnSaveReceivers}
            title="Save this address"
            onPress={onSaveReceivers}
            titleStyle={styleSheet.titleReceivers}
          />,
        );
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  return [btnSave];
};
