import { Text, View } from '@src/components/core';
import {
  RFBaseInput,
  validator,
} from '@src/components/core/reduxForm';
import Extra, { styled as extraStyled, Hook } from '@src/components/PdexV3/Extra';
import {
  SelectOptionInput,
  SelectOptionModal,
} from '@src/components/SelectOption';
import { PRV } from '@src/constants/common';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { useSelector } from '@src/store/getStore';
import { actionToggleModal } from '@src/store/modal/functions';
import { formConfigs, KEYS_PLATFORMS_SUPPORTED } from '@src/store/pdexV3/swap/constants';
import { actionChangeSlippage, actionEstimateTrade, actionHandleInjectEstDataForPancake, actionHandleInjectEstDataForPDex, actionHandleInjectEstDataForUni, actionSetFeeToken, actionSwitchPlatform } from '@src/store/pdexV3/swap/functions';
import { feetokenDataSelector, inputAmountSelector, isPrivacyAppSelector, platformIdSelectedSelector, platformsSupportedSelector1, slippagetoleranceSelector, swapInfoSelector, swapSelector } from '@src/store/pdexV3/swap/selectors';
import { maxAmountValidatorForSlippageTolerance, maxFeeValidator, minFeeValidator } from '@src/store/pdexV3/swap/utils';
import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';
import { FONTS } from '@src/styles';
import { toNumber } from '@src/utils/common';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { change, Field } from 'redux-form';
import { getInterSwapTradePath } from './Swap.simpleTab';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  icon: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
});

const TabPro = React.memo(() => {
  const { networkfee } = useSelector(swapSelector);
  const swapInfo = useSelector(swapInfoSelector);
  const { toggleProTab, isFetching } = swapInfo;
  const slippagetolerance = useSelector(slippagetoleranceSelector);
  const feetokenData = useSelector(feetokenDataSelector);
  const inputAmount = useSelector(inputAmountSelector);
  const sellinputAmount = inputAmount(formConfigs.selltoken);
  const prv: SelectedPrivacy = useSelector(getPrivacyDataByTokenID)(PRV.id);
  const platformId = useSelector(platformIdSelectedSelector);
  const isPrivacyApp = useSelector(isPrivacyAppSelector);
  const dispatch = useDispatch();
  const { hooks: hooksFactory } = getInterSwapTradePath(feetokenData);

  const onChangeTypeFee = async (type) => {
    const { tokenId } = type;
    await actionSetFeeToken(tokenId)
    switch (platformId) {
      case KEYS_PLATFORMS_SUPPORTED.incognito:
        await actionHandleInjectEstDataForPDex()
        break;
      case KEYS_PLATFORMS_SUPPORTED.pancake:
        await actionHandleInjectEstDataForPancake();
        break;
      case KEYS_PLATFORMS_SUPPORTED.uni:
      case KEYS_PLATFORMS_SUPPORTED.uniEther:
        await actionHandleInjectEstDataForUni(platformId)
        break;
      default:
        break;
    }
  };
  const onEndEditing = () => {
    if (Number(slippagetolerance) > 100 || slippagetolerance < 0) {
      return;
    }
    if (!sellinputAmount.amount || sellinputAmount.amount < 0) {
      return;
    }

    dispatch(actionEstimateTrade());

    // const minAmount = calMintAmountExpected({
    //   maxGet: feetokenData?.maxGet,
    //   slippagetolerance,
    // });

    // const amount = format.toFixed(
    //   convert.toHumanAmount(minAmount, buyInputAmount.pDecimals),
    //   buyInputAmount.pDecimals
    // );

    // dispatch(change(formConfigs.formName, formConfigs.buytoken, amount));
  };

  let _minFeeValidator = React.useCallback(
    () => minFeeValidator(feetokenData, isFetching),
    [
      feetokenData?.origininalFeeAmount,
      feetokenData?.minFeeOriginal,
      feetokenData?.symbol,
      feetokenData?.minFeeAmountText,
      isFetching,
    ],
  );
  let _maxFeeValidator = React.useCallback(
    () =>
      maxFeeValidator({
        originalAmount: sellinputAmount?.originalAmount,
        availableOriginalAmount: sellinputAmount?.availableOriginalAmount,
        selltoken: sellinputAmount?.tokenId,
        feetoken: feetokenData?.feetoken,
        origininalFeeAmount: feetokenData?.origininalFeeAmount,
        networkfee,
        prvBalance: prv?.amount || 0,
        isFetching,
      }),
    [
      sellinputAmount?.originalAmount,
      sellinputAmount?.availableOriginalAmount,
      sellinputAmount?.tokenId,
      feetokenData?.feetoken,
      feetokenData?.origininalFeeAmount,
      prv?.amount,
      isFetching,
    ],
  );
  let _maxAmountValidatorForSlippageTolerance = React.useCallback(
    () => maxAmountValidatorForSlippageTolerance(slippagetolerance),
    [slippagetolerance],
  );
  const platforms = useSelector(platformsSupportedSelector1);
  const options = React.useMemo(
    () =>
      platforms.map((platform) => {
        const isSelected = platform.isSelected;
        return {
          ...platform,
          onPressItem: async (id) => {
            if (isSelected) {
              return;
            }
            actionSwitchPlatform(id)
            actionToggleModal()
          },
        };
      }),
    [platforms],
  );
  const platformSelected = options.find((option) => !!option?.isSelected);
  const extraFactories = [
    {
      title: 'Slippage tolerance',
      titleStyle: {
        fontSize: FONTS.SIZE.small,
      },
      hasQuestionIcon: true,
      onPressQuestionIcon: () => null,
      hooks: (
        <Field
          component={RFBaseInput}
          name={formConfigs.slippagetolerance}
          rightCustom={<Text style={extraStyled.value}>%</Text>}
          keyboardType="decimal-pad"
          placeholder="0"
          ellipsizeMode="tail"
          numberOfLines={1}
          onEndEditing={onEndEditing}
          validate={[
            ...validator.combinedNumber,
            _maxAmountValidatorForSlippageTolerance,
          ]}
          inputStyle={{
            flex: 1,
          }}
          editableInput={!!swapInfo?.editableInput}
          onChange={(slippage) => {
            dispatch(
              change(
                formConfigs.formName,
                formConfigs.slippagetolerance,
                slippage,
              ),
            );
            let _slippage = slippage;
            if (isNaN(toNumber(slippage, true))) {
              _slippage = '1';
            }
            actionChangeSlippage(_slippage)
          }}
        />
      ),
    },
  ];
  const switchFactory = [];
  if (!isPrivacyApp) {
      switchFactory.push({
      title: 'Switch exchanges',
      onPressQuestionIcon: () => null,
      titleStyle: {
        fontSize: FONTS.SIZE.small,
      },
      hooks: (
        <SelectOptionInput
          options={options}
          actived={platformSelected}
          isSelectItem={false}
          onPressItem={() => {
            options.length > 1 &&
              dispatch(
                actionToggleModal({
                  visible: true,
                  shouldCloseModalWhenTapOverlay: true,
                  data: <SelectOptionModal options={options} />,
                }),
              );
          }}
        />
      ),
    });
  }
  return (
    <View
      style={{
        ...(toggleProTab ? {} : { display: 'none', opacity: 0 }),
        ...styled.container,
      }}
    >
      {switchFactory.map((extra) => (
        <Extra {...extra} key={extra.label} />
      ))}
      {!!hooksFactory && hooksFactory.length > 0 && (
      <View style={{ marginBottom: 16 }}>
        {hooksFactory.map((item) => (<Hook {...item} key={item.label} />))}
      </View>
      )}
      {extraFactories.map((extra) => (
        <Extra {...extra} key={extra.label} />
      ))}
    </View>
  );
});

export default React.memo(TabPro);
