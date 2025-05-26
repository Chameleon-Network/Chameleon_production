import React, {memo} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';

import withLiquidity from './Liquidity.enhance';
import {
  createForm,
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import styled from './Liquidity.styled';
import {Field} from 'redux-form';
import {View} from '@components/core';
import {batch, useDispatch, useSelector} from 'react-redux';

import NetworkFee from '@src/components/NetworkFee';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import globalStyled from '@src/theme/theme.styled';
import {COLORS, FONTS} from '@src/styles';
import {
  formConfigsRemovePool,
  LIQUIDITY_MESSAGES,
  SUCCESS_MODAL,
} from '@src/store/pdexV3/liquidity/constants';
import {
  disableRemovePool,
  feeAmountSelector,
  hookFactoriesSelector,
  inputAmountSelector,
  maxShareAmountSelector,
  nftTokenSelector,
  poolIDSelector,
  validateTotalBurnPRVSelector,
} from '@src/store/pdexV3/liquidity/removePoolSelector';
import {
  actionChangeInputRemovePool,
  actionChangeOutputRemovePool,
  actionChangePercentRemovePool,
  actionMaxRemovePool,
} from '@src/store/pdexV3/liquidity/functions';
import AddBreakLine from '@src/components/core/AddBreakLine';
import {actionFaucetPRV} from '@src/store/token/functions';
import {actionRefillPRVModalVisible} from '@src/store/refillPRV/functions';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import RowSpaceText from '@src/components/core/RowSpaceText';
import {isFetchingSelector} from '@src/store/pdexV3/pools/selectors';
import {goBack} from '@src/router/NavigationServices';
import Header from '@src/components/Header/Header';
import SuccessModal from '@src/components/SuccessModal';
import {withTransaction} from './Liquidity.enhanceTransaction';

const initialFormValues = {
  inputToken: '',
  outputToken: '',
};

const Form = createForm(formConfigsRemovePool.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const InputsGroup = () => {
  const dispatch = useDispatch();
  const [percent, setPercent] = React.useState(0);
  const inputAmount = useSelector(inputAmountSelector);
  const inputToken = inputAmount(
    formConfigsRemovePool.formName,
    formConfigsRemovePool.inputToken,
  );
  const outputToken = inputAmount(
    formConfigsRemovePool.formName,
    formConfigsRemovePool.outputToken,
  );
  const {maxInputShareStr, maxOutputShareStr} =
    useSelector(maxShareAmountSelector) || {};
  const onChangeInput = text => actionChangeInputRemovePool(text);
  const onChangeOutput = text => actionChangeOutputRemovePool(text);
  const onMaxPress = () => actionMaxRemovePool();
  const onChangePercent = _percent => {
    setPercent(_percent);
    if (_percent === 100) {
      return onMaxPress();
    }
    actionChangePercentRemovePool(_percent);
  };
  const _validateInput = React.useCallback(() => {
    return inputToken?.error;
  }, [inputToken?.error]);
  const _validateOutput = React.useCallback(() => {
    return outputToken?.error;
  }, [outputToken?.error]);
  return (
    <>
      <View style={styled.inputBox}>
        <Field
          component={TradeInputAmount}
          name={formConfigsRemovePool.inputToken}
          validate={[_validateInput, ...validator.combinedNumber]}
          editableInput={!inputToken?.loadingBalance}
          srcIcon={inputToken && inputToken?.iconUrl}
          symbol={inputToken && inputToken?.symbol}
          onChange={onChangeInput}
          onPressInfinityIcon={onMaxPress}
          hasInfinityIcon
        />
        <AddBreakLine />
        <Field
          component={TradeInputAmount}
          name={formConfigsRemovePool.outputToken}
          validate={[_validateOutput, ...validator.combinedNumber]}
          symbol={outputToken && outputToken?.symbol}
          srcIcon={outputToken && outputToken?.iconUrl}
          editableInput={!outputToken?.loadingBalance}
          onChange={onChangeOutput}
          onPressInfinityIcon={onMaxPress}
          visibleHeader
          hasInfinityIcon
        />
      </View>
    </>
  );
};

const RemoveLPButton = React.memo(({onSubmit}) => {
  const dispatch = useDispatch();
  const {disabled} = useSelector(disableRemovePool);
  const amountSelector = useSelector(inputAmountSelector);
  const {feeAmount} = useSelector(feeAmountSelector);
  const poolId = useSelector(poolIDSelector);
  const nftId = useSelector(nftTokenSelector);
  const inputAmount = amountSelector(
    formConfigsRemovePool.formName,
    formConfigsRemovePool.inputToken,
  );
  const outputAmount = amountSelector(
    formConfigsRemovePool.formName,
    formConfigsRemovePool.outputToken,
  );
  const {isEnoughtPRVNeededAfterBurn, isCurrentPRVBalanceExhausted} =
    useSelector(validateTotalBurnPRVSelector);

  const handleSubmit = async () => {
    // console.log('[handleSubmit] disabled ', disabled);
    if (disabled) return;
    // console.log('isEnoughtTotalPRVAfterBurned ', isEnoughtTotalPRVAfterBurned);

    if (isCurrentPRVBalanceExhausted) {
      await actionFaucetPRV(<FaucetPRVModal />);
      return;
    }

    if (!isEnoughtPRVNeededAfterBurn) {
      actionRefillPRVModalVisible(true);
    } else {
      const params = {
        fee: feeAmount,
        poolTokenIDs: [inputAmount?.tokenId, outputAmount?.tokenId],
        poolPairID: poolId,
        shareAmount: inputAmount?.withdraw,
        nftID: nftId,
        amount1: String(inputAmount?.originalInputAmount),
        amount2: String(outputAmount?.originalInputAmount),
      };
      onSubmit(params);
    }
  };

  return (
    <ButtonTrade
      btnStyle={mainStyle.button}
      title={LIQUIDITY_MESSAGES.removePool}
      onPress={handleSubmit}
    />
  );
});

export const Extra = React.memo(() => {
  const hooks = useSelector(hookFactoriesSelector);
  const renderHooks = () => {
    return hooks
      .filter(item => !!item)
      .map(item => <RowSpaceText {...item} key={item?.label} />);
  };
  return <View style={{marginTop: 20}}>{renderHooks()}</View>;
});

const RemovePool = ({
  onInitRemovePool,
  onRemoveContribute,
  onCloseModal,
  visible,
  error,
}) => {
  const isFetching = useSelector(isFetchingSelector);
  const {feeAmountStr, showFaucet} = useSelector(feeAmountSelector);
  const onSubmit = params => {
    typeof onRemoveContribute === 'function' && onRemoveContribute(params);
  };
  const onClose = () => {
    batch(() => {
      onCloseModal();
      onInitRemovePool();
      goBack();
    });
  };

  const renderContent = () => (
    <>
      <InputsGroup />
      <View style={styled.padding}>
        {!!error && <Text style={styled.warning}>{error}</Text>}
        <RemoveLPButton onSubmit={onSubmit} />
        <Extra />
        {showFaucet && <NetworkFee feeStr={feeAmountStr} />}
      </View>
    </>
  );

  React.useEffect(() => {
    onInitRemovePool();
  }, []);
  return (
    <>
      <Header style={styled.padding} />
      <View borderTop style={styled.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onInitRemovePool}
            />
          }
          showsVerticalScrollIndicator={false}>
          <Form>{renderContent()}</Form>
        </ScrollView>
      </View>
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.REMOVE_POOL.title}
        buttonTitle="OK"
        extraInfo={SUCCESS_MODAL.REMOVE_POOL.desc}
        visible={visible}
      />
    </>
  );
};

export default withLiquidity(withTransaction(memo(RemovePool)));

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
