/* eslint-disable import/no-cycle */
import {TouchableOpacity, View} from '@src/components/core';
import Button from '@src/components/core/Button';
import {
  createForm,
  InputField,
  validator,
} from '@src/components/core/reduxForm';
import Header from '@src/components/Header/Header';
import {CONSTANT_COMMONS} from '@src/constants';
import {navigateToSelectNetworkName} from '@src/router/NavigationServices';
import {selectedReceiverSelector} from '@src/store/receivers/selectors';
import React from 'react';
import {StyleSheet} from 'react-native';
import Icons from 'react-native-vector-icons/Fontisto';
import {useSelector} from 'react-redux';
import {Field} from 'redux-form';
import withForm from './FrequentReceivers.withForm';

const styled = StyleSheet.create({
  form: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 50,
  },
  btnAngleRight: {
    justifyContent: 'center',
  },
});

export const formName = 'formFrequentReceivers';

const isRequired = validator.required();

const FormDt = createForm(formName);

const Hook = () => {
  const {rootNetworkName} = useSelector(selectedReceiverSelector);
  const isEVMNetwork =
    rootNetworkName === CONSTANT_COMMONS.NETWORK_NAME.ETHEREUM ||
    rootNetworkName === CONSTANT_COMMONS.NETWORK_NAME.TOMO ||
    rootNetworkName === CONSTANT_COMMONS.NETWORK_NAME.BSC;
  const handleChooseTypeNetwork = () => navigateToSelectNetworkName();
  if (!isEVMNetwork) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={handleChooseTypeNetwork}
      style={styled.btnAngleRight}>
      <Icons name="angle-right" size={16} />
    </TouchableOpacity>
  );
};

interface FormProps {
  headerTitle: string;
  onSaveReceiver: () => void;
  disabledBtn: boolean;
  titleBtnSubmit: string;
  shouldShowNetwork: boolean;
}

const Form = (props: FormProps) => {
  const {
    headerTitle,
    titleBtnSubmit,
    onSaveReceiver,
    disabledBtn,
    shouldShowNetwork,
  } = props;
  return (
    <>
      <Header title={headerTitle} />
      <View fullFlex borderTop paddingHorizontal>
        <FormDt style={styled.form}>
          {({handleSubmit}) => (
            <View>
              <Field
                componentProps={{
                  style: {
                    marginTop: 0,
                  },
                }}
                component={InputField}
                placeholder="Name"
                name="name"
                label="Name"
                validate={isRequired}
                maxLength={50}
              />
              <Field
                component={InputField}
                label="Address"
                name="address"
                placeholder="Address"
                validate={isRequired}
                componentProps={{
                  canEditable: false,
                }}
              />
              {shouldShowNetwork && (
                <Field
                  component={InputField}
                  label="Network"
                  name="networkName"
                  componentProps={{
                    canEditable: false,
                  }}
                  prependView={<Hook />}
                />
              )}
              <Button
                title={titleBtnSubmit}
                buttonStyle={styled.submitBtn}
                onPress={handleSubmit(onSaveReceiver)}
                disabled={disabledBtn}
              />
            </View>
          )}
        </FormDt>
      </View>
    </>
  );
};

export default withForm(Form);
