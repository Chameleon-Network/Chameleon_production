import React from 'react';
import { ScrollView, View } from 'react-native';
import { createForm, RFTradeInputAmount as TradeInputAmount, validator } from '@components/core/reduxForm';
import { formConfigsInvest, STAKING_MESSAGES } from '@screens/PDexV3/features/Staking/Staking.constant';
import { useDispatch, useSelector } from 'react-redux';
import {change, Field, focus, getFormSyncErrors} from 'redux-form';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import Header from '@components/Header/Header';
import { coinStyles as coinStyled } from '@screens/PDexV3/features/Staking/Staking.styled';
import { RoundCornerButton, Text } from '@components/core';
import withInput from '@screens/PDexV3/features/Staking/Staking.enhanceInput';
import PropTypes from 'prop-types';
import { stakingSelector } from '@screens/PDexV3/features/Staking';
import withInvest from '@screens/PDexV3/features/Staking/Staking.investEnhance';
import { compose } from 'recompose';
import withTransaction from '@screens/PDexV3/features/Staking/Staking.transaction';
import {NFTTokenBottomBar, NFTTokenModal} from '@screens/PDexV3/features/NFTToken';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import { RowSpaceText}  from '@src/components';
import NetworkFee from '@src/components/NetworkFee';
import {actionToggleModal} from '@components/Modal';

const initialFormValues = {
  input: ''
};

const Form = createForm(formConfigsInvest.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const Input = React.memo(({ onInvestMax, onSymbolPress }) => {
  const dispatch = useDispatch();
  const { maxDepositText, token } = useSelector(stakingSelector.investInputAmount);
  const inputValidate = useSelector(stakingSelector.investInputValidate);
  const onChangeText = (text) => dispatch(change(formConfigsInvest.formName, formConfigsInvest.input, text));
  const onChangeMaxInvest = () => onInvestMax(maxDepositText);
  return(
    <Field
      component={TradeInputAmount}
      name={formConfigsInvest.input}
      symbol={token?.symbol}
      srcIcon={token.iconUrl}
      visibleHeader
      validate={[...validator.combinedAmount, inputValidate]}
      editableInput
      onChange={onChangeText}
      onPressSymbol={onSymbolPress}
      hasInfinityIcon
      onPressInfinityIcon={onChangeMaxInvest}
    />
  );
});

const CustomInput = withInput(Input);

const StakingMoreInput = React.memo(({ onSymbolPress, onStaking, error }) => {
  const pool = useSelector(stakingSelector.investPoolSelector);
  const dispatch = useDispatch();
  const { feeAmount } = useSelector(stakingSelector.stakingFeeSelector);
  const { nftStaking } = useSelector(stakingSelector.investStakingCoinSelector);
  const { inputValue, tokenId, inputSymbolStr } = useSelector(stakingSelector.investInputAmount);
  const { disabled, title: btnTitle } = useSelector(stakingSelector.investButton);
  const formErrors = useSelector((state) =>
    getFormSyncErrors(formConfigsInvest.formName)(state),
  );
  const onSubmit = () => {
    const fields = [
      formConfigsInvest.input,
    ];
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      if (formErrors[field]) {
        return dispatch(focus(formConfigsInvest.formName, field));
      }
    }
    if (!nftStaking) {
      return dispatch(
        actionToggleModal({
          visible: true,
          shouldCloseModalWhenTapOverlay: true,
          data: <NFTTokenModal />,
        }),
      );
    }
    if (disabled || !!error || !feeAmount || !tokenId || !inputValue || !nftStaking) return;
    const params = {
      fee: feeAmount,
      tokenID: tokenId,
      tokenAmount: String(inputValue),
      nftID: nftStaking,
      stakingAmountStr: inputSymbolStr
    };
    typeof onStaking === 'function' && onStaking(params);
  };
  const renderContent = () => {
    if (!pool) return;
    return (
      <Form>
        {() => (
          <>
            <CustomInput
              onSymbolPress={onSymbolPress}
            />
            {!!error && (<Text style={coinStyled.error}>{error}</Text>)}
            <RoundCornerButton
              title={btnTitle}
              style={coinStyled.button}
              onPress={onSubmit}
            />
            <NetworkFee />
            <View style={mainStyle.extra}>
              <RowSpaceText label={`${pool.symbol} Balance`} value={pool.userBalanceDisplay} />
            </View>
          </>
        )}
      </Form>
    );
  };
  return (
    <>
      <View style={mainStyle.container}>
        <Header title={STAKING_MESSAGES.staking} />
        <View style={coinStyled.coinContainer}>
          <ScrollView>
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </>
  );
});

Input.propTypes = {
  onInvestMax: PropTypes.func.isRequired,
  onSymbolPress: PropTypes.func.isRequired,
  rightHeader: PropTypes.element.isRequired
};

StakingMoreInput.defaultProps = {
  error: undefined
};
StakingMoreInput.propTypes = {
  onSymbolPress: PropTypes.func.isRequired,
  onStaking: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default compose(
  withTransaction,
  withInvest,
  withFetch,
)(StakingMoreInput);
