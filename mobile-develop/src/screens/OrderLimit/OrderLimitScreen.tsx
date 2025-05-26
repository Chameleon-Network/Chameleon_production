import ButtonBasic from '@src/components/Button/ButtonBasic';
import {LoadingContainer, RefreshControl} from '@src/components/core';
import KeyboardAwareScrollView from '@src/components/core/KeyboardAwareScrollView';
import {createForm} from '@src/components/core/reduxForm';
import withLazy from '@src/components/LazyHoc/withLazy';
import LoadingTx from '@src/components/LoadingTx';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import {nftTokenDataSelector} from '@src/store/account/selectors';
import {useSelector} from '@src/store/getStore';
import {actionToggleModal} from '@src/store/modal/functions';
import {
  formConfigs,
  HISTORY_ORDERS_STATE,
  OPEN_ORDERS_STATE,
} from '@src/store/pdexV3/oderLimit/constants';
import {
  actionBookOrder,
  actionFetchOrdersHistory,
  actionInit,
  actionResetOrdersHistory,
  actionSetPoolSelected,
} from '@src/store/pdexV3/oderLimit/functions';
import {
  orderLimitDataSelector,
  orderLimitSelector,
  sellInputAmountSelector,
} from '@src/store/pdexV3/oderLimit/selectors';
import {ROOT_TAB_TRADE, TAB_SWAP_ID} from '@src/store/pdexV3/trade/constant';
import {actionRefillPRVModalVisible} from '@src/store/refillPRV/functions';
import {validatePRVBalanceSelector} from '@src/store/selectedPrivacy/selectors';
import {actionChangeTab} from '@src/store/tabs/functions';
import {actionFaucetPRV} from '@src/store/token/functions';
import React, {memo} from 'react';
import {useDispatch} from 'react-redux';
import {focus, getFormSyncErrors} from 'redux-form';
import {NFTTokenModal} from '../NFTToken';
import {TradeSuccessModal} from '../TradePDexV3';
import OrderDetails from './OrderLimit.details';
import GroupSubInfo from './OrderLimit.groupSubInfo';
import OrderLimitInputsGroup from './OrderLimit.inputsGroup';
import {styled} from './OrderLimit.styled';

const initialFormValues = {
  selltoken: '',
  buytoken: '',
  feetoken: '',
  rate: '',
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const OrderLimitScreen = memo(() => {
  const dispatch = useDispatch();
  const {cfmTitle, disabledBtn, errorNetworkFee, networkfee} = useSelector(
    orderLimitDataSelector,
  );
  const {isFetching, isFetched} = useDebounceSelector(orderLimitSelector);
  const {nftTokenAvailable} = useDebounceSelector(nftTokenDataSelector);
  const sellInputAmount = useDebounceSelector(sellInputAmountSelector);
  const {isEnoughtPRVNeededAfterBurn, isCurrentPRVBalanceExhausted} =
    useSelector(validatePRVBalanceSelector)(networkfee);

  const [ordering, setOrdering] = React.useState(false);
  const formErrors = useDebounceSelector(state =>
    getFormSyncErrors(formConfigs.formName)(state),
  );
  const handleConfirm = async () => {
    try {
      if (ordering || errorNetworkFee) {
        return;
      }

      if (!isEnoughtPRVNeededAfterBurn) {
        actionRefillPRVModalVisible(true);
        actionChangeTab({rootTabID: ROOT_TAB_TRADE, tabID: TAB_SWAP_ID});
        return;
      }

      await setOrdering(true);
      const fields = [
        formConfigs.selltoken,
        formConfigs.buytoken,
        formConfigs.rate,
      ];
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (formErrors[field]) {
          return dispatch(focus(formConfigs.formName, field));
        }
      }
      if (!sellInputAmount.isMainCrypto && isCurrentPRVBalanceExhausted) {
        await actionFaucetPRV(<FaucetPRVModal />);
        return;
      }

      if (!nftTokenAvailable) {
        return actionToggleModal({
          visible: true,
          shouldCloseModalWhenTapOverlay: true,
          data: <NFTTokenModal />,
        });
      }
      if (disabledBtn) {
        return;
      }
      const tx = await actionBookOrder();
      if (tx) {
        actionToggleModal({
          data: (
            <TradeSuccessModal
              title="Order placed!"
              desc={cfmTitle}
              sub="Your balance will update as the order fills."
              handleTradeSucesss={() => {
                console.log('book order limit');
              }}
            />
          ),
          visible: true,
        });
      }
    } catch {
      //
    } finally {
      setOrdering(false);
    }
  };
  const onRefresh = () => {
    actionInit(true, true);
    actionFetchOrdersHistory(HISTORY_ORDERS_STATE);
    actionFetchOrdersHistory(OPEN_ORDERS_STATE);
  };
  const callback = async poolId => {
    actionResetOrdersHistory();
    await actionSetPoolSelected(poolId);
    actionInit(true);
  };

  const {
    mainColor,
    btnActionTitle,
    ordering: orderingLimitDataSelector,
    calculating,
  } = useDebounceSelector(orderLimitDataSelector);

  React.useEffect(() => {
    onRefresh();
  }, []);

  if (isFetching && !isFetched) {
    return <LoadingContainer />;
  }

  return (
    <>
      <KeyboardAwareScrollView
        style={styled.container}
        refreshControl={
          <RefreshControl refreshing={calculating} onRefresh={onRefresh} />
        }>
        <Form>{() => <OrderLimitInputsGroup />}</Form>
        <OrderDetails />
        <ButtonBasic
          btnStyle={{
            backgroundColor: mainColor,
            borderRadius: 8,
            marginTop: 24,
            marginBottom: 16,
          }}
          title={btnActionTitle}
          onPress={handleConfirm}
        />
        <GroupSubInfo />
      </KeyboardAwareScrollView>
      {!!orderingLimitDataSelector && <LoadingTx />}
    </>
  );
});

export default withLazy(React.memo(OrderLimitScreen));
