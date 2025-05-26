import {ExHandler} from '@services/exception';
import Loading from '@src/components/core/ActivityIndicator/Loading';
import SuccessModal from '@src/components/SuccessModal';
import {navigateToLiquidityHistories} from '@src/router/NavigationServices';
import {actionSetNFTTokenData} from '@src/store/account/functions';
import {actionGetPDexV3Inst} from '@src/store/pdexV3/functions';
import {SUCCESS_MODAL} from '@src/store/pdexV3/liquidity/constants';
import {actionGetHistories} from '@src/store/pdexV3/liquidityHistories/functions';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import {batch, useDispatch} from 'react-redux';

const withContributeDetail = WrappedComp => props => {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const onSuccess = () => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };
  const onClose = () => {
    setVisible(false);
    batch(() => {
      actionGetHistories();
      actionSetNFTTokenData();
    });
    setTimeout(() => {
      navigateToLiquidityHistories();
    }, 500);
  };
  const handleRefund = async ({
    fee,
    tokenID,
    poolPairID,
    pairHash,
    nftID,
    amplifier,
  }) => {
    if (loading) return;
    setLoading(true);
    try {
      const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
      await pDexV3Inst.createAndSendContributeRequestTx({
        transfer: {fee, tokenID},
        extra: {
          poolPairID,
          pairHash,
          contributedAmount: String(1),
          nftID,
          amplifier,
        },
      });
      onSuccess();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      setLoading(false);
    }
  };
  const handleRetry = async ({
    fee,
    tokenID,
    poolPairID,
    pairHash,
    nftID,
    amplifier,
    amount,
  }) => {
    if (loading) return;
    setLoading(true);
    try {
      const pDexV3Inst = await actionGetPDexV3Inst();
      await pDexV3Inst.createAndSendContributeRequestTx({
        transfer: {fee, tokenID},
        extra: {
          poolPairID,
          pairHash,
          contributedAmount: String(amount),
          nftID,
          amplifier,
        },
      });
      onSuccess();
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleRefund,
          handleRetry,
        }}
      />
      <Loading open={loading} />
      <SuccessModal
        closeSuccessDialog={onClose}
        title={SUCCESS_MODAL.ADD_POOL.title}
        buttonTitle="OK"
        description={SUCCESS_MODAL.ADD_POOL.desc}
        visible={visible}
      />
    </ErrorBoundary>
  );
};

export default withContributeDetail;
