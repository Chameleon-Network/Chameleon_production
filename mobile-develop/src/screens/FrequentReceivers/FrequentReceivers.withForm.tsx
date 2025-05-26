/* eslint-disable import/no-cycle */
import {CONSTANT_KEYS} from '@src/constants';
import {useNavigationParam} from '@src/hooks';
import {goBack, navigateToWallet} from '@src/router/NavigationServices';
import {ExHandler} from '@src/services/exception';
import ToastService from '@src/services/ToastService';
import {actionCreate, actionUpdate} from '@src/store/receivers/functions';
import {selectedReceiverSelector} from '@src/store/receivers/selectors';
import {selectedPrivacy as selectedPrivacySelector} from '@src/store/selectedPrivacy/selectors';
import {isEqual, toLower} from 'lodash';
import React from 'react';
import {Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {change, formValueSelector, isValid} from 'redux-form';
import {formName} from './FrequentReceivers.form';

const enhance = WrappedComp => (props: any) => {
  const selectedPrivacy = useSelector(selectedPrivacySelector);
  const action = useNavigationParam('action', '');
  const info = useNavigationParam('info', {address: '', name: ''});
  const keySave = useNavigationParam('keySave', '');
  const headerTitle = useNavigationParam('headerTitle', '');
  const dispatch = useDispatch();
  const {address, name} = info;
  const isUpdate = action === 'update';
  const titleBtnSubmit = isUpdate ? 'Save changes' : 'Save to address book';
  const isFormValid = useSelector(state => isValid(formName)(state));
  const selector = formValueSelector(formName);
  const nameInput = useSelector(state => selector(state, 'name')) || '';
  let shouldUpdate = !isEqual(toLower(nameInput), toLower(name));
  const disabledBtn = !isFormValid || (isUpdate && !shouldUpdate);
  const selectedReceiver = useSelector(selectedReceiverSelector);
  const shouldShowNetwork =
    selectedReceiver?.keySave ===
    CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK;

  const onCreateReceiver = async ({name, address}) => {
    try {
      const receiver = {
        name,
        address,
      };
      await actionCreate({
        keySave,
        receiver: {
          ...receiver,
          recently: new Date().getTime(),
          rootNetworkName: selectedPrivacy?.rootNetworkName,
          tokenId: selectedPrivacy?.tokenId,
        },
      });
      ToastService.show('Saved!');
      return navigateToWallet();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const onUpdateReceiver = async ({name, address}) => {
    try {
      const receiver = {
        name,
        address,
      };
      await actionUpdate({
        keySave,
        receiver,
      });
      ToastService.show('Updated!');
      // return navigation.pop(); //TODO
      return goBack();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const onSaveReceiver = async data => {
    if (disabledBtn) {
      return;
    }
    Keyboard.dismiss();
    if (action === 'update') {
      return onUpdateReceiver(data);
    }
    return onCreateReceiver(data);
  };

  React.useEffect(() => {
    if (!isUpdate) {
      return dispatch(change(formName, 'address', address));
    }
    if (selectedReceiver) {
      const {address, name} = selectedReceiver;
      dispatch(change(formName, 'address', address));
      dispatch(change(formName, 'name', name));
      if (shouldShowNetwork) {
        dispatch(
          change(formName, 'networkName', selectedReceiver?.rootNetworkName),
        );
      }
    }
  }, [selectedReceiver, address]);
  return (
    <WrappedComp
      {...{
        ...props,
        onSaveReceiver,
        headerTitle,
        disabledBtn,
        titleBtnSubmit,
        shouldShowNetwork,
      }}
    />
  );
};

export default enhance;
