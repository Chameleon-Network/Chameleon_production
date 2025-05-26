import {createForm} from '@components/core/reduxForm';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import {RefreshControl} from '@src/components/core';
import KeyboardAwareScrollView from '@src/components/core/KeyboardAwareScrollView';
import withLazy from '@src/components/LazyHoc/withLazy';
import LoadingTx from '@src/components/LoadingTx';
import UnifiedInforAlert from '@src/components/UnifiedInforAlert';
import {MESSAGES, PRV} from '@src/constants';
import {navigateToConvertToUnifiedToken} from '@src/router/NavigationServices';
import {ExHandler} from '@src/services/exception';
import {getCurrentRouteName} from '@src/services/RouteNameService';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {getCurrentPaymentAddressSelector} from '@src/store/account/selectors';
import {useSelector} from '@src/store/getStore';
import {actionToggleModal} from '@src/store/modal/functions';
import {formConfigs, SWAP_DEFAULT_FAIR} from '@src/store/pdexV3/swap/constants';
import {
  actionFetchPairs,
  actionFetchSwap,
  actionInitSwapForm,
  actionNavigateFormMarketTab,
  actionReset,
  actionSaveUnifiedAlertStateById,
  actionToggleProTab,
} from '@src/store/pdexV3/swap/functions';
import {
  buyInputTokenSeletor,
  feeErorSelector,
  feetokenDataSelector,
  getEsimateTradeError,
  getIsNavigateFromMarketTab,
  getIsNavigateToSelectToken,
  isToggleUnifiedInfoSelector,
  swapFormErrorSelector,
  swapInfoSelector,
  validateTotalBurningPRVSelector,
} from '@src/store/pdexV3/swap/selectors';
import {actionRefillPRVModalVisible} from '@src/store/refillPRV/functions';
import throttle from 'lodash/throttle';
import React, {memo, useEffect, useState} from 'react';
import {batch} from 'react-redux';
import {focus as focusReduxForm, reset} from 'redux-form';
import RemoveStorageDialog from '../Setting/RemoveStorage/RemoveStorageDialog';
import {TradeSuccessModal} from '../TradePDexV3';
import ErrorMessage from './Swap.errorMessage';
import SwapEstimateTradeError from './Swap.estimateTradeError';
import SwapGroupSubInfo from './Swap.groupSubInfo';
import SwapInputsGroup from './Swap.inputsGroup';
import {styled} from './Swap.styled';
import {NativeScrollEvent} from 'react-native';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  slippagetolerance: '',
  feetoken: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const SCREENS_RESET = ['Market', 'HomeLP', 'Assets', 'PrivacyApps', 'More'];

const Swap = memo(() => {
  const isFocused = useIsFocused();
  const currentScreen = getCurrentRouteName();

  const swapInfo = useDebounceSelector(swapInfoSelector);
  const isToggleUnifiedInfor = useSelector(
    isToggleUnifiedInfoSelector,
  ) as boolean;
  const currentPaymentAddress = useSelector(getCurrentPaymentAddressSelector);

  const [page, setPage] = React.useState(0);
  const [isExpandPage, setIsExpandPage] = React.useState(false);

  const formErrors = useSelector(swapFormErrorSelector);
  const buyInputToken = useSelector(buyInputTokenSeletor);
  const feeTokenData = useSelector(feetokenDataSelector);
  const estimateTradeError = useSelector(getEsimateTradeError);

  const setLoadPage = () => {
    if (!isExpandPage) return;
    setPage(page => page + 4);
  };

  const _debounceLoadPage = throttle(() => {
    setLoadPage();
  }, 2000);

  const setShowHistory = isShow => {
    setIsExpandPage(isShow);
    if (!isShow) {
      return setPage(0);
    }
    setPage(page => page + 5);
  };

  const saveAnswerAction = (answer: boolean) => {
    return actionSaveUnifiedAlertStateById({
      paymentAddress: currentPaymentAddress,
      timeStamp: new Date().getTime(),
      answer,
    });
  };
  const cancelOnClick = () => {
    saveAnswerAction(false);
  };

  const confirmOnClick = () => {
    saveAnswerAction(true);
    navigateToConvertToUnifiedToken();
  };

  const onTouchOutside = () => {
    console.log('onTouchOutside TO DO');
  };

  useEffect(() => {
    actionFetchPairs(true);
  }, []);

  useEffect(() => {
    if (!isFocused && SCREENS_RESET.includes(currentScreen || '')) {
      setTimeout(() => {
        batch(() => {
          actionReset();
          actionInitSwapForm({
            refresh: false,
            defaultPair: SWAP_DEFAULT_FAIR.INCOGNITO,
            shouldFetchHistory: false,
          });
          reset(formConfigs.formName);
        });
      }, 100);
    }
  }, [isFocused, currentScreen]);

  const {isEnoughtPRVNeededAfterBurn} = useSelector(
    validateTotalBurningPRVSelector,
  );

  const prvFeeError = useSelector(feeErorSelector);

  const isNavigateFromMarketTab = useSelector(getIsNavigateFromMarketTab);
  const navigateToSelectToken = useSelector(getIsNavigateToSelectToken);

  const [visibleSignificant, setVisibleSignificant] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    initSwapForm();
    actionNavigateFormMarketTab(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (isNavigateFromMarketTab || navigateToSelectToken) {
        return;
      }
    }, [isNavigateFromMarketTab, navigateToSelectToken]),
  );

  const initSwapForm = (refresh = false) => {
    return actionInitSwapForm({
      defaultPair,
      refresh,
      shouldFetchHistory: true,
    });
  };

  const handleCreateSwapOrder = async () => {
    try {
      const tx = await actionFetchSwap();
      if (tx) {
        setTimeout(() => {
          actionToggleModal({
            data: (
              <TradeSuccessModal
                title="Swap initiated!"
                desc={`You placed an order to sell\n${
                  swapInfo?.sellInputAmountStr || ''
                } for ${swapInfo?.buyInputAmountStr || ''}.`}
                handleTradeSucesss={() => initSwapForm()}
                sub="Your balance will update in a couple of minutes after the swap is finalized."
              />
            ),
            visible: true,
          });
        }, 500);
      }
    } catch (e) {
      if (typeof e === 'string') {
        setErrorMessage(e);
      }
      if (typeof e === 'object') {
        const jsonObj = JSON.stringify(e);
        const info = e.code || e.name;
        const message = e.detail || e.message;
        const errorMessage = `[${info}]: ${message}`;
        // console.log(jsonObj);
        if (jsonObj.includes('-3001') || jsonObj.includes('UTXO')) {
          setErrorMessage(MESSAGES.MAXIMUM_UTXO_ERROR);
        } else {
          setErrorMessage(errorMessage);
        }
      } else {
        new ExHandler(e).showErrorToast();
      }
    }
  };

  const handleConfirm = async () => {
    try {
      if (ordering) {
        return;
      }

      // if (isNeedFaucet) {
      //   navigateToFaucetWeb();
      //   return;
      // }
      // if (!sellInputToken.isMainCrypto && isCurrentPRVBalanceExhausted) {
      //   await dispatch(actionFaucetPRV(<FaucetPRVModal />));
      //   return;
      // }

      await setOrdering(true);
      await setErrorMessage(true);

      const fields = [formConfigs.selltoken, formConfigs.buytoken];
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (formErrors[field]) {
          return focusReduxForm(formConfigs.formName, field);
        }
      }

      if (estimateTradeError || prvFeeError) {
        return;
      }

      if (!isEnoughtPRVNeededAfterBurn && buyInputToken.tokenId !== PRV.id) {
        actionRefillPRVModalVisible(true);
        actionReset();
        initSwapForm();
        return;
      }

      if (
        swapInfo?.disabledBtnSwap &&
        !formErrors[formConfigs.selltoken] &&
        !formErrors[formConfigs.buytoken] &&
        (!!formErrors[formConfigs.slippagetolerance] ||
          !!formErrors[formConfigs.feetoken])
      ) {
        actionToggleProTab(true);
        return;
      }
      const {isSignificant} = feeTokenData;
      if (isSignificant) {
        return setVisibleSignificant(true);
      }
      await handleCreateSwapOrder();
    } catch {
      //
    } finally {
      setOrdering(false);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={[styled.scrollview]}
        refreshControl={
          <RefreshControl
            refreshing={swapInfo?.refreshing}
            onRefresh={initSwapForm}
          />
        }
        onScroll={({nativeEvent}) => {
          if (
            isCloseToBottom(nativeEvent) &&
            typeof setLoadPage === 'function'
          ) {
            _debounceLoadPage();
          }
        }}
        scrollEventThrottle={600}>
        <Form>
          {() => (
            <>
              <SwapInputsGroup />
              <SwapEstimateTradeError />
              <ErrorMessage errorMessage={errorMessage} />
              <ButtonTrade
                btnStyle={styled.btnTrade}
                onPress={handleConfirm}
                title={swapInfo?.btnSwapText || ''}
              />
            </>
          )}
        </Form>
        <SwapGroupSubInfo
          page={page}
          isExpandPage={isExpandPage}
          setShowHistory={setShowHistory}
        />
      </KeyboardAwareScrollView>
      {!!swapInfo.swaping && <LoadingTx />}
      {isToggleUnifiedInfor && (
        <UnifiedInforAlert
          isVisible={isToggleUnifiedInfor}
          cancelOnClick={cancelOnClick}
          confirmOnClick={confirmOnClick}
          onTouchOutside={onTouchOutside}
        />
      )}
      <RemoveStorageDialog
        visible={visibleSignificant}
        onPressCancel={() => setVisibleSignificant(false)}
        onPressAccept={() => {
          setVisibleSignificant(false);
          handleCreateSwapOrder().then();
        }}
        title="Warning"
        subTitle="Do note that due to trade size, the price of this trade varies significantly from market price."
        acceptStr="Accept"
      />
    </>
  );
});

export default withLazy(React.memo(Swap));
