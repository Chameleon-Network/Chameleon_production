import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {
  createForm,
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import {View, RefreshControl} from '@components/core';
import {useDispatch, useSelector} from 'react-redux';
import {change, Field, focus, getFormSyncErrors} from 'redux-form';
import styled from './Liquidity.styled';
import {withTransaction} from './Liquidity.enhanceTransaction';
import NetworkFee from '@src/components/NetworkFee';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import {FONTS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import {COLORS} from '@src/styles';
import {
  formConfigsCreatePool,
  LIQUIDITY_MESSAGES,
  SUCCESS_MODAL,
} from '@src/store/pdexV3/liquidity/constants';
import {
  ampValueSelector,
  disableCreatePool,
  feeAmountSelector,
  focusFieldSelector,
  hookFactoriesSelector,
  inp,
  inputTokensListSelector,
  isTypingSelector,
  isTypingSelectorutTokensListSelector,
  outputTokensListSelector,
  validateNetworkFeeSelector,
  validateTotalBurnPRVSelector,
} from '@src/store/pdexV3/liquidity/createPoolSelector';
import {inputAmountSelector} from '@src/store/pdexV3/liquidity/createPoolSelector';
import {
  actionSetCreatePoolText,
  actionSetFocusCreatePool,
  actionSetTypingCreatePool,
  actionUpdateCreatePoolInputToken,
  actionUpdateCreatePoolOutputToken,
  asyncActionDebounced,
  debouncedGetCreatePoolRate,
} from '@src/store/pdexV3/liquidity/functions';
import {navigateToSelectTokenModal} from '@src/router/NavigationServices';
import AddBreakLine from '@src/components/core/AddBreakLine';
import RowSpaceText from '@src/components/core/RowSpaceText';
import {actionToggleModal} from '@src/store/modal/functions';
import {NFTTokenModal} from '../NFTToken';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import {isFetchingSelector} from '@src/store/pdexV3/pools/selectors';
import useSendSelf from './Liquidity.useSendSelf';
import {actionFaucetPRV} from '@src/store/token/functions';
import {actionRefillPRVModalVisible} from '@src/store/refillPRV/functions';
import NetworkFeeError from './Liquidity.networkFeeError';
import Header from '@src/components/Header/Header';
import SuccessModal from '@src/components/SuccessModal';
import withLazy from '@src/components/LazyHoc/withLazy';
import withLiquidity from './Liquidity.enhance';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsCreatePool.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = () => {
  const dispatch = useDispatch();
  const inputAmount = useSelector(inputAmountSelector);
  const inputTokens = useSelector(inputTokensListSelector);
  const outputTokens = useSelector(outputTokensListSelector);
  const focusField = useSelector(focusFieldSelector);
  const isTyping = useSelector(isTypingSelector);
  const inputToken = inputAmount(
    formConfigsCreatePool.formName,
    formConfigsCreatePool.inputToken,
  );
  const outputToken = inputAmount(
    formConfigsCreatePool.formName,
    formConfigsCreatePool.outputToken,
  );

  const onChangeText = text => actionSetCreatePoolText(text);
  const onFocusToken = (e, focusField) =>
    actionSetFocusCreatePool({focusField});
  const onGetRate = () => {
    if (
      !inputToken?.originalInputAmount ||
      !outputToken?.originalInputAmount ||
      !inputToken?.tokenId ||
      !outputToken?.tokenId
    )
      return;
    const params = {
      inputAmount: inputToken.originalInputAmount,
      inputToken: inputToken.tokenId,
      outputAmount: outputToken.originalInputAmount,
      outputToken: outputToken.tokenId,
    };
    actionSetTypingCreatePool({isTyping: true});
    debouncedGetCreatePoolRate.cancel();
    asyncActionDebounced(params, debouncedGetCreatePoolRate);
  };
  const _validateInput = React.useCallback(() => {
    return inputToken?.error;
  }, [inputToken?.error]);
  const _validateOutput = React.useCallback(() => {
    return outputToken?.error;
  }, [outputToken?.error]);

  const loading = React.useMemo(
    () => ({
      input:
        inputToken?.loadingBalance ||
        (isTyping && focusField === formConfigsCreatePool.inputToken),
      output:
        outputToken?.loadingBalance ||
        (isTyping && focusField === formConfigsCreatePool.outputToken),
    }),
    [
      focusField,
      isTyping,
      inputToken?.loadingBalance,
      outputToken?.loadingBalance,
    ],
  );

  const onSelectSymbol = (callback, tokens) => {
    navigateToSelectTokenModal({
      data: tokens,
      onPress: callback,
    });
  };

  React.useEffect(() => {
    onGetRate();
  }, [
    inputToken?.originalInputAmount,
    inputToken?.tokenId,
    outputToken?.originalInputAmount,
    outputToken?.tokenId,
  ]);

  return (
    <View style={styled.inputBox}>
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.inputToken}
        canSelectSymbol
        symbol={inputToken && inputToken?.symbol}
        validate={[_validateInput, ...validator.combinedAmount]}
        onFocus={e => onFocusToken(e, formConfigsCreatePool.inputToken)}
        onChange={onChangeText}
        editableInput={!inputToken.loadingBalance}
        loadingBalance={loading.input}
        hasInfinityIcon={!!inputToken && !!inputToken?.balanceStr}
        onPressInfinityIcon={() => {
          dispatch(
            change(
              formConfigsCreatePool.formName,
              formConfigsCreatePool.inputToken,
              inputToken.maxOriginalAmountText,
            ),
          );
        }}
        onPressSymbol={() => {
          if (loading.input) return;
          onSelectSymbol(token => {
            setTimeout(
              () => actionUpdateCreatePoolInputToken(token.tokenId),
              300,
            );
          }, inputTokens);
        }}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigsCreatePool.outputToken}
        canSelectSymbol
        visibleHeader
        symbol={outputToken && outputToken?.symbol}
        hasInfinityIcon={!!outputToken && !!outputToken?.balanceStr}
        validate={[_validateOutput, ...validator.combinedAmount]}
        onChange={onChangeText}
        editableInput={!outputToken?.loadingBalance}
        loadingBalance={loading.output}
        onPressSymbol={() => {
          if (loading.output) return;
          onSelectSymbol(token => {
            setTimeout(
              () => actionUpdateCreatePoolOutputToken(token.tokenId),
              300,
            );
          }, outputTokens);
        }}
        onFocus={e => onFocusToken(e, formConfigsCreatePool.outputToken)}
        onPressInfinityIcon={() => {
          dispatch(
            change(
              formConfigsCreatePool.formName,
              formConfigsCreatePool.outputToken,
              outputToken?.maxOriginalAmountText,
            ),
          );
        }}
      />
    </View>
  );
};

export const Extra = React.memo(() => {
  const hooks = useSelector(hookFactoriesSelector);
  const renderHooks = () => {
    return hooks
      .filter(item => !!item)
      .map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return <View style={{marginTop: 20}}>{renderHooks()}</View>;
});

const ButtonCreatePool = React.memo(({onSubmit}) => {
  const dispatch = useDispatch();
  const {disabled, nftTokenAvailable} = useSelector(disableCreatePool);
  const amountSelector = useSelector(inputAmountSelector);
  const inputAmount = amountSelector(
    formConfigsCreatePool.formName,
    formConfigsCreatePool.inputToken,
  );
  const outputAmount = amountSelector(
    formConfigsCreatePool.formName,
    formConfigsCreatePool.outputToken,
  );
  const {feeAmount, feeAmountStr, showFaucet} = useSelector(feeAmountSelector);
  const {amp, estOutputStr} = useSelector(ampValueSelector);
  const formErrors = useSelector(state =>
    getFormSyncErrors(formConfigsCreatePool.formName)(state),
  );
  const handleSubmit = () => {
    const fields = [
      formConfigsCreatePool.inputToken,
      formConfigsCreatePool.outputToken,
    ];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (formErrors[field]) {
        return dispatch(focus(formConfigsCreatePool.formName, field));
      }
    }
    if (!nftTokenAvailable) {
      return actionToggleModal({
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
        data: <NFTTokenModal />,
      });
    }
    if (disabled) return;
    const params = {
      fee: feeAmount / 2,
      tokenId1: inputAmount?.tokenId,
      tokenId2: outputAmount?.tokenId,
      amount1: String(inputAmount?.originalInputAmount),
      amount2: String(outputAmount?.originalInputAmount),
      amp,
    };
    onSubmit(params);
  };
  const changeEstRate = () =>
    !!estOutputStr &&
    dispatch(
      change(
        formConfigsCreatePool.formName,
        formConfigsCreatePool.outputToken,
        estOutputStr,
      ),
    );
  return (
    <>
      {!!estOutputStr && (
        <View style={mainStyle.extra}>
          {LIQUIDITY_MESSAGES.estRate(changeEstRate)}
        </View>
      )}
      <ButtonTrade
        btnStyle={mainStyle.button}
        title={LIQUIDITY_MESSAGES.createPool}
        onPress={handleSubmit}
      />
      {showFaucet && <NetworkFee feeStr={feeAmountStr} />}
    </>
  );
});

const CreatePool = ({
  onInitCreatePool,
  onFreeCreatePool,
  onCreateNewPool,
  visible,
  onCloseModal,
  setLoading,
  setError,
  error,
}) => {
  const isFetching = useSelector(isFetchingSelector);
  const {isEnoughNetworkFee} = useSelector(validateNetworkFeeSelector);
  const _error = useSendSelf({error, setLoading, setError});
  const {isEnoughtPRVNeededAfterBurn, isCurrentPRVBalanceExhausted} =
    useSelector(validateTotalBurnPRVSelector);
  const onSubmit = async params => {
    // console.log('isEnoughtTotalPRVAfterBurned ', isEnoughtTotalPRVAfterBurned);

    if (isCurrentPRVBalanceExhausted) {
      await actionFaucetPRV(<FaucetPRVModal />);
      return;
    }

    if (!isEnoughtPRVNeededAfterBurn) {
      actionRefillPRVModalVisible(true);
    } else {
      typeof onCreateNewPool === 'function' && onCreateNewPool(params);
    }
  };

  const onClose = () => {
    onCloseModal();
    onInitCreatePool();
  };

  const renderContent = () => (
    <>
      <InputsGroup />
      <View style={styled.padding}>
        {!!_error && <Text style={styled.warning}>{_error}</Text>}
        <ButtonCreatePool onSubmit={onSubmit} />
        <Extra />
        {!isEnoughNetworkFee && <NetworkFeeError />}
      </View>
    </>
  );
  React.useEffect(() => {
    onInitCreatePool();
    return () => onFreeCreatePool();
  }, []);
  return (
    <>
      <Header style={styled.padding} />
      <View borderTop style={styled.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onInitCreatePool}
            />
          }
          showsVerticalScrollIndicator={false}>
          <Form>{renderContent()}</Form>
        </ScrollView>
      </View>
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.ADD_POOL.title}
        buttonTitle="OK"
        extraInfo={SUCCESS_MODAL.ADD_POOL.desc}
        visible={visible}
      />
    </>
  );
};

export default withLazy(withLiquidity(withTransaction(memo(CreatePool))));

export const mainStyle = StyleSheet.create({
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
