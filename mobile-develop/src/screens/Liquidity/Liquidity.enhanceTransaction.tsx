import React from 'react';
import {batch} from 'react-redux';
import {ExHandler} from '@services/exception';
import {actionGetPDexV3Inst} from '@src/store/pdexV3/functions';
import Loading from '@src/components/core/ActivityIndicator/Loading';
import {actionFetch} from '@src/store/pdexV3/portforlio/functions';
import ToastService from '@src/services/ToastService';

export const withTransaction = WrappedComp => props => {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState('');
  const onShowSuccess = () => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  };
  const onClose = () => {
    setVisible(false);
  };
  const onCreateContributes = async ({
    fee,
    tokenId1,
    tokenId2,
    amount1,
    amount2,
    poolPairID,
    amp,
    nftID,
  }) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await actionGetPDexV3Inst();
      await pDexV3Inst.createContributeTxs({
        fee,
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        poolPairID,
        amp,
        nftID,
      });
      // setTimeout(() => {
      //   dispatch(
      //     requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.CONTRIBUTE_LP, {
      //       token_id1: tokenId1,
      //       token_id2: tokenId2,
      //       token_amount1: amount1,
      //       token_amount2: amount2,
      //     }),
      //   );
      // }, 300);
      onShowSuccess();
    } catch (error) {
      console.log('[onCreateContributes] ERROR: ', error);
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };
  const onCreateNewPool = async ({
    fee,
    tokenId1,
    tokenId2,
    amount1,
    amount2,
    amp,
  }) => {
    // console.log('[onCreateNewPool] ', {
    //   fee,
    //   tokenId1,
    //   tokenId2,
    //   amount1,
    //   amount2,
    //   amp,
    // });
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await actionGetPDexV3Inst();
      await pDexV3Inst.createContributeTxs({
        fee,
        tokenId1,
        tokenId2,
        amount1,
        amount2,
        poolPairID: '',
        amp,
      });
      // setTimeout(() => {
      //   dispatch(
      //     requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.CONTRIBUTE_NEW_LP, {
      //       token_id1: tokenId1,
      //       token_id2: tokenId2,
      //       token_amount1: amount1,
      //       token_amount2: amount2,
      //     }),
      //   );
      // }, 300);
      onShowSuccess();
    } catch (error) {
      console.log('[onCreateNewPool] ERROR: ', error);
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };
  const onRemoveContribute = async ({
    fee,
    poolTokenIDs,
    poolPairID,
    shareAmount,
    nftID,
    amount1,
    amount2,
  }) => {
    // console.log('[onRemoveContribute] params ', {
    //   fee,
    //   poolTokenIDs,
    //   poolPairID,
    //   shareAmount,
    //   nftID,
    //   amount1,
    //   amount2,
    // });
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await actionGetPDexV3Inst();
      const result = await pDexV3Inst.createAndSendWithdrawContributeRequestTx({
        fee,
        poolTokenIDs,
        poolPairID,
        shareAmount,
        nftID,
        amount1,
        amount2,
      });

      console.log('[onRemoveContribute] result: ', result);
      // setTimeout(() => {
      //   dispatch(
      //     requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.REMOVE_LP, {
      //       token_id1: poolTokenIDs[0],
      //       token_id2: poolTokenIDs[1],
      //       share_amount: shareAmount,
      //       pool_pair_id: poolPairID,
      //     }),
      //   );
      // }, 300);
      onShowSuccess();
    } catch (error) {
      console.log('[onRemoveContribute] ERROR: ', error);
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
    }
  };

  const endWithdrawFee = () => {
    batch(() => {
      onClose();
      actionFetch();
    });
  };

  const onCreateWithdrawFeeLP = async ({
    fee,
    withdrawTokenIDs,
    poolPairID,
    nftID,
    amount1,
    amount2,
  }) => {
    if (loading) return;
    try {
      setLoading(true);
      const pDexV3Inst = await actionGetPDexV3Inst();
      await pDexV3Inst.createAndSendWithdrawLPFeeRequestTx({
        fee,
        withdrawTokenIDs,
        poolPairID,
        nftID,
        amount1,
        amount2,
      });
      endWithdrawFee();
    } catch (error) {
      console.log('[onCreateWithdrawFeeLP] ERROR: ', error);
      ToastService.show(error.message || (typeof error === 'string' && error));
      setError(new ExHandler(error).getMessage(error?.message));
    } finally {
      setLoading(false);
      endWithdrawFee();
    }
  };

  return (
    <>
      <WrappedComp
        {...{
          ...props,
          onCreateContributes,
          onCreateNewPool,
          onRemoveContribute,
          onCreateWithdrawFeeLP,
          onCloseModal: onClose,
          loading,
          setLoading,
          visible,
          error,
          setError,
        }}
      />
      {loading && <Loading />}
    </>
  );
};
