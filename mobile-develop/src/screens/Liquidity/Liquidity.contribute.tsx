import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {
  LIQUIDITY_MESSAGES,
  formConfigsContribute,
  SUCCESS_MODAL,
} from '@src/store/pdexV3/liquidity/constants';
import {
  createForm,
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import {useDispatch, useSelector} from 'react-redux';
import styled from './Liquidity.styled';
import {Field, focus, getFormSyncErrors} from 'redux-form';
import {RefreshControl, View} from '@components/core';
import withLiquidity from './Liquidity.enhance';
import {withTransaction} from './Liquidity.enhanceTransaction';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import {FONTS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import {COLORS} from '@src/styles';
import SuccessModal from '@src/components/SuccessModal';
import Header from '@src/components/Header/Header';
import {
  disableContribute,
  feeAmountSelector,
  inputAmountSelector,
  mappingDataSelector,
  nftTokenSelector,
  poolIDSelector,
  statusSelector,
  validateTotalBurnPRVSelector,
  validateNetworkFeeSelector,
} from '@src/store/pdexV3/liquidity/contributeSelector';
import {
  actionChangeInputContribute,
  actionChangeOutputContribute,
} from '@src/store/pdexV3/liquidity/functions';
import RowSpaceText from '@src/components/core/RowSpaceText';
import {actionToggleModal} from '@src/store/modal/functions';
import {NFTTokenModal} from '../NFTToken';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import AddBreakLine from '@src/components/core/AddBreakLine';
import {actionRefillPRVModalVisible} from '@src/store/refillPRV/functions';
import {actionFaucetPRV} from '@src/store/token/functions';
import useSendSelf from './Liquidity.useSendSelf';
import NetworkFeeError from './Liquidity.networkFeeError';
import NetworkFee from '@src/components/NetworkFee';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsContribute.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = React.memo(() => {
  const {inputToken, outputToken} = useSelector(mappingDataSelector);
  const onChangeInput = (newText: string) =>
    actionChangeInputContribute(newText);
  const onChangeOutput = (newText: string) =>
    actionChangeOutputContribute(newText);
  const onMaxInput = () =>
    actionChangeInputContribute(inputAmount?.maxOriginalAmountText);
  const onMaxOutput = () =>
    actionChangeOutputContribute(outputAmount?.maxOriginalAmountText);
  const amountSelector = useSelector(inputAmountSelector);
  const inputAmount = amountSelector(
    formConfigsContribute.formName,
    formConfigsContribute.inputToken,
  );
  const outputAmount = amountSelector(
    formConfigsContribute.formName,
    formConfigsContribute.outputToken,
  );
  const _validateInput = React.useCallback(() => {
    return inputAmount?.error;
  }, [inputAmount?.error]);
  const _validateOutput = React.useCallback(() => {
    return outputAmount?.error;
  }, [outputAmount?.error]);
  return (
    <View style={styled.inputBox}>
      <Field
        component={TradeInputAmount}
        name={formConfigsContribute.inputToken}
        symbol={inputToken && inputToken?.symbol}
        srcIcon={inputToken && inputToken?.iconUrl}
        validate={[_validateInput, ...validator.combinedAmount]}
        hasInfinityIcon
        onChange={onChangeInput}
        editableInput={!inputAmount?.loadingBalance}
        loadingBalance={inputAmount?.loadingBalance}
        onPressInfinityIcon={onMaxInput}
      />
      <AddBreakLine visibleAdd />
      <Field
        component={TradeInputAmount}
        name={formConfigsContribute.outputToken}
        hasInfinityIcon
        symbol={outputToken && outputToken?.symbol}
        srcIcon={outputToken && outputToken?.iconUrl}
        validate={[_validateOutput, ...validator.combinedAmount]}
        visibleHeader
        onChange={onChangeOutput}
        editableInput={!outputAmount?.loadingBalance}
        loadingBalance={outputAmount?.loadingBalance}
        onPressInfinityIcon={onMaxOutput}
      />
    </View>
  );
});

export const Extra = React.memo(() => {
  const data = useSelector(mappingDataSelector);
  const renderHooks = () => {
    if (!data) return;
    return (data?.hookFactories || [])
      .filter(item => !!item)
      .map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return <View style={mainStyle.extra}>{renderHooks()}</View>;
});

const ContributeButton = React.memo(({onSubmit}) => {
  const dispatch = useDispatch();
  const amountSelector = useSelector(inputAmountSelector);
  const inputAmount = amountSelector(
    formConfigsContribute.formName,
    formConfigsContribute.inputToken,
  );
  const outputAmount = amountSelector(
    formConfigsContribute.formName,
    formConfigsContribute.outputToken,
  );
  const {feeAmount} = useSelector(feeAmountSelector);
  const poolId = useSelector(poolIDSelector);
  const {amp} = useSelector(mappingDataSelector);
  const {nftToken} = useSelector(nftTokenSelector);
  const {isDisabled, nftTokenAvailable} = useSelector(disableContribute);
  const formErrors = useSelector(state =>
    getFormSyncErrors(formConfigsContribute.formName)(state),
  );
  const createContributes = async () => {
    const fields = [
      formConfigsContribute.inputToken,
      formConfigsContribute.outputToken,
    ];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (formErrors[field]) {
        return dispatch(focus(formConfigsContribute.formName, field));
      }
    }
    if (!nftTokenAvailable) {
      return actionToggleModal({
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
        data: <NFTTokenModal />,
      });
    }
    if (isDisabled) return;
    const params = {
      fee: feeAmount / 2,
      tokenId1: inputAmount?.tokenId,
      tokenId2: outputAmount?.tokenId,
      amount1: String(inputAmount?.originalInputAmount),
      amount2: String(outputAmount?.originalInputAmount),
      poolPairID: poolId,
      amp,
      nftID: nftToken,
    };
    onSubmit(params);
  };

  return (
    <ButtonTrade
      btnStyle={mainStyle.button}
      title={LIQUIDITY_MESSAGES.addLiquidity}
      onPress={createContributes}
    />
  );
});

interface ContributeProps {
  onInitContribute: () => void;
  onCreateContributes: (params: any) => void;
  onCloseModal: () => void;
  visible: boolean;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  error: string;
}

const Contribute = ({
  onInitContribute,
  onCreateContributes,
  visible,
  onCloseModal,
  setLoading,
  setError,
  error,
}: ContributeProps) => {
  const isFetching = useSelector(statusSelector);
  const {feeAmountStr, showFaucet} = useSelector(feeAmountSelector);
  const {isEnoughNetworkFee} = useSelector(validateNetworkFeeSelector);
  const {isEnoughtPRVNeededAfterBurn, isCurrentPRVBalanceExhausted} =
    useSelector(validateTotalBurnPRVSelector);

  const _error = useSendSelf({error, setLoading, setError});
  const onSubmit = async params => {
    // console.log('isEnoughtTotalPRVAfterBurned ', isEnoughtTotalPRVAfterBurned);

    if (isCurrentPRVBalanceExhausted) {
      await actionFaucetPRV(<FaucetPRVModal />);
      return;
    }

    if (!isEnoughtPRVNeededAfterBurn) {
      actionRefillPRVModalVisible(true);
      return;
    } else {
      typeof onCreateContributes === 'function' && onCreateContributes(params);
    }
  };
  const onClose = () => {
    onCloseModal();
    onInitContribute();
  };
  React.useEffect(() => {
    if (typeof onInitContribute === 'function') onInitContribute();
  }, []);

  return (
    <>
      <Header style={styled.padding} />
      <View borderTop style={styled.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onInitContribute}
            />
          }
          showsVerticalScrollIndicator={false}>
          <Form>
            {() => (
              <>
                <InputsGroup />
                <View style={styled.padding}>
                  {!!_error && <Text style={styled.warning}>{_error}</Text>}
                  <ContributeButton onSubmit={onSubmit} />
                  {!!showFaucet && <NetworkFee feeStr={feeAmountStr} />}
                  <Extra />
                  {!isEnoughNetworkFee && <NetworkFeeError />}
                </View>
              </>
            )}
          </Form>
        </ScrollView>
      </View>
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.CREATE_POOL.title}
        buttonTitle="OK"
        extraInfo={SUCCESS_MODAL.CREATE_POOL.desc}
        visible={visible}
      />
    </>
  );
};

export default withLiquidity(withTransaction(memo(Contribute)));

const mainStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flex: 1,
  },
  fullFlex: {
    flex: 1,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
    height: 50,
    borderRadius: 8,
  },
  scrollView: {
    marginBottom: 70,
  },
  mainInfo: {
    marginVertical: 20,
  },
  bigText: {
    ...FONTS.STYLE.bold,
    color: COLORS.colorTradeBlue,
    fontSize: 35,
    lineHeight: 45,
  },
  error: {
    color: COLORS.red,
    lineHeight: 22,
  },
  extra: {
    marginTop: 25,
  },
  tab1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...globalStyled.defaultPaddingHorizontal,
    paddingBottom: 16,
  },
  styledTabList1: {},
});
