import {
  RFTradeInputAmount as TradeInputAmount,
  validator,
} from '@components/core/reduxForm';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { throttle } from 'lodash';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { change, Field } from 'redux-form';

import { useNavigation } from '@react-navigation/native';
import SwapButton from '@src/components/core/SwapButton';
import ToggleArrow from '@src/components/ToggleArrow';
import { navigateToSelectToken } from '@src/router/NavigationServices';
import { formConfigs } from '@src/store/pdexV3/swap/constants';
import { actionEstimateTrade, actionGetMaxAmount, actionNavigateToSelectToken, actionResetData, actionSelectToken, actionSetFocusToken, actionSwapToken, actionToggleProTab } from '@src/store/pdexV3/swap/functions';
import { buytokenSelector, feetokenDataSelector, getTotalFeePRVSelector, inputAmountSelector, platformSelectedSelector, selltokenSelector, swapInfoSelector, swapSelector } from '@src/store/pdexV3/swap/selectors';
import { maxAmountValidatorForPRVSellInput, maxAmountValidatorForSellInput } from '@src/store/pdexV3/swap/utils';
import { getPrivacyPRVInfo } from '@src/store/selectedPrivacy/selectors';
import SwapDetails from './Swap.details';
import SwapFeeError from './Swap.feeError';
import SwapProTab from './Swap.proTab';
import { InterSwapMsg } from './Swap.simpleTab';
import { inputGroupStyled as styled } from './Swap.styled';

const SwapInputsGroup = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const swap = useSelector(swapSelector);
  const selltoken: SelectedPrivacy = useSelector(selltokenSelector);
  const buytoken: SelectedPrivacy = useSelector(buytokenSelector);
  const feetokenData: SelectedPrivacy = useSelector(feetokenDataSelector);
  const privacyPRVInfo: SelectedPrivacy = useSelector(getPrivacyPRVInfo);
  const totalFeePRV: SelectedPrivacy = useSelector(getTotalFeePRVSelector);

  const platform = useSelector(platformSelectedSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const buyInputAmount = inputAmount(formConfigs.buytoken);

  const onSelectToken = async (token, field) => {
    actionSelectToken(token, field)
  };

  const onSelectSellToken = () => {
    actionNavigateToSelectToken(true)
    navigateToSelectToken({
      data: {
        from: 'sellToken',
        tokenId: selltoken.tokenId,
      },
      onPress: (token) => onSelectToken(token, formConfigs.selltoken),
    })
  }

  const onSelectBuyToken = () => {
    actionNavigateToSelectToken(true)
    navigateToSelectToken({
      data: {
        from: 'buyToken',
        tokenId: buytoken.tokenId,
      },
      onPress: (token) => onSelectToken(token, formConfigs.buytoken),
    });
  };

  const onFocusToken = (e, field) => actionSetFocusToken(swap[field]);
  const onEndEditing = (field) => actionEstimateTrade({ field });
  const onSwapButtons = () => {
    actionSwapToken();
    actionResetData();
    change(formConfigs.formName, formConfigs.feetoken, '');
  };

  let _maxAmountValidatorForSellInput = React.useCallback(
    (inputValue) =>
      maxAmountValidatorForSellInput(
        sellInputAmount,
        buyInputAmount,
        feetokenData,
        navigation,
        swapInfo,
        inputValue,
        privacyPRVInfo,
      ),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
      feetokenData?.minFeeOriginalToken,
      feetokenData?.minFeeOriginal,
      navigation,
      buyInputAmount?.originalAmount,
      buyInputAmount?.availableOriginalAmount,
      privacyPRVInfo,
    ],
  );

  const onPressInfinityIcon = useCallback(
    throttle(
      async () => {
        const { availableAmountText, maxAmount } = await actionGetMaxAmount()

        dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
        dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));

        await dispatch(
          change(
            formConfigs.formName,
            formConfigs.selltoken,
            availableAmountText,
          ),
        );
        if (maxAmount > 0) {
          dispatch(
            actionEstimateTrade({ field: formConfigs.selltoken, useMax: true }),
          );
        } else {
          actionResetData()
        }
      },
      3500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [],
  );

  let _maxAmountValidatorForPRVSellInput = React.useCallback(
    (inputValue) =>
      maxAmountValidatorForPRVSellInput(
        sellInputAmount,
        buyInputAmount,
        feetokenData,
        navigation,
        swapInfo,
        inputValue,
        privacyPRVInfo,
        totalFeePRV,
      ),
    [
      sellInputAmount?.originalAmount,
      sellInputAmount?.availableOriginalAmount,
      sellInputAmount?.availableAmountText,
      sellInputAmount?.symbol,
      feetokenData?.minFeeOriginalToken,
      feetokenData?.minFeeOriginal,
      navigation,
      buyInputAmount?.originalAmount,
      buyInputAmount?.availableOriginalAmount,
      privacyPRVInfo,
      totalFeePRV,
    ],
  );

  const onChange = (field, value) => {
    dispatch(change(formConfigs.formName, field, value));
    switch (field) {
      case formConfigs.selltoken:
        dispatch(change(formConfigs.formName, formConfigs.buytoken, ''));
        break;
      case formConfigs.buytoken:
        dispatch(change(formConfigs.formName, formConfigs.selltoken, ''));
        break;
      default:
        break;
    }
  };
  return (
    <View style={styled.inputGroups}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.selltoken}
        hasInfinityIcon
        canSelectSymbol
        symbol={selltoken?.symbol}
        onChange={(value) => onChange(formConfigs.selltoken, value)}
        onPressSymbol={onSelectSellToken}
        onFocus={(e) => onFocusToken(e, formConfigs.selltoken)}
        onEndEditing={() => onEndEditing(formConfigs.selltoken)}
        onPressInfinityIcon={onPressInfinityIcon}
        validate={[
          ...(selltoken.isIncognitoToken
            ? validator.combinedNanoAmount
            : validator.combinedAmount),
          _maxAmountValidatorForPRVSellInput,
          _maxAmountValidatorForSellInput,
        ]}
        loadingBalance={!!sellInputAmount?.loadingBalance}
        editableInput={!!swapInfo?.editableInput}
      />
      <SwapButton onSwapButtons={onSwapButtons} />
      <Field
        component={TradeInputAmount}
        name={formConfigs.buytoken}
        canSelectSymbol
        symbol={buytoken?.symbol}
        onPressSymbol={onSelectBuyToken}
        onFocus={(e) => onFocusToken(e, formConfigs.buytoken)}
        // onEndEditing={() => onEndEditing(formConfigs.buytoken)}
        onEndEditing={() => onEndEditing(formConfigs.selltoken)}
        validate={[...validator.combinedAmount]}
        loadingBalance={!!buyInputAmount?.loadingBalance}
        editableInput={false}
        visibleHeader={false}
        onChange={(value) => onChange(formConfigs.buytoken, value)}
      />
      <InterSwapMsg />
      <ToggleArrow
        label="Advanced"
        toggle={swapInfo?.toggleProTab}
        handlePressToggle={() =>
          actionToggleProTab(!swapInfo?.toggleProTab)
        }
        style={styled.toggleArrow}
      />
      <SwapProTab />
      <SwapDetails />
      <SwapFeeError />
    </View>
  );
});

export default SwapInputsGroup;
