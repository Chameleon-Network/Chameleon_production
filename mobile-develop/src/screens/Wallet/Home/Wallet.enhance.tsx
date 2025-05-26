import React from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { ExHandler } from '@src/services/exception';
import { CONSTANT_KEYS } from '@src/constants';
import { withdraw, updatePTokenFee } from '@src/services/api/withdraw';
import { debounce } from 'lodash';
import { unShieldStorageDataSelector } from '@src/store/unShield/selectors';
import { signPublicKeyEncodeSelector } from '@src/store/account/selectors';
import { actionRemoveStorageDataCentralized, actionRemoveStorageDataDecentralized } from '@src/store/unShield/functions';
import { useFocusEffect } from '@react-navigation/native';

export const withToken = WrappedComp => props => {
  const unshieldStorage = useSelector(unShieldStorageDataSelector);
  const signPublicKeyEncode = useSelector(
    signPublicKeyEncodeSelector,
  );

  const handleRemoveStorageTxsUnshield = ({ txID, keySave } = {}) => {
    try {
      let fn, payload;
      if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED) {
        payload = {
          keySave: CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED,
          burningTxId: txID,
        };
        fn = actionRemoveStorageDataDecentralized;
      } else {
        fn = actionRemoveStorageDataCentralized;
        payload = {
          keySave: CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED,
          txId: txID,
        };
      }
      if (typeof fn === 'function' && payload) {
        fn(payload);
      }
    } catch (error) {
      console.log('handleRemoveStorageTxsUnshield error: ', error);
    }
  };

  const retryLastTxsUnshieldDecentralized = async () => {
    try {
      const keyUnshieldDecentralized =
        CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED;
      const txs = unshieldStorage[keyUnshieldDecentralized]?.txs || [];
      txs &&
        txs.map(async tx => {
          if (tx) {
            withdraw({ ...tx, signPublicKeyEncode })
              .then(() => {
                handleRemoveStorageTxsUnshield({
                  txID: tx?.burningTxId,
                  keySave: keyUnshieldDecentralized,
                });
              })
              .catch(error => {
                if (
                  error &&
                  error?.code &&
                  error?.code === 'API_ERROR(-1034)'
                ) {
                  // tx submited => no need call to much
                  handleRemoveStorageTxsUnshield({
                    txID: tx?.burningTxId,
                    keySave: keyUnshieldDecentralized,
                  });
                }
              });
          }
        });
    } catch (e) {
      console.log('error', e);
    }
  };
  const retryLastTxsUnshieldCentralized = async () => {
    try {
      const keyUnshieldCentralized = CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED;
      const txs = unshieldStorage[keyUnshieldCentralized]?.txs || [];
      txs &&
        txs.map(async tx => {
          if (tx) {
            updatePTokenFee({ ...tx, signPublicKeyEncode })
              .then(() => {
                handleRemoveStorageTxsUnshield({
                  txID: tx?.txId,
                  keySave: keyUnshieldCentralized,
                });
              })
              .catch(error => {
                if (
                  error &&
                  error?.code &&
                  error?.code === 'API_ERROR(-1034)'
                ) {
                  // tx submited => no need call to much
                  handleRemoveStorageTxsUnshield({
                    txID: tx?.txId,
                    keySave: keyUnshieldCentralized,
                  });
                }
              });
          }
        });
    } catch (e) {
      console.log('error', e);
    }
  };
  const onRefresh = async () => {
    try {
      batch(() => {
        retryLastTxsUnshieldDecentralized();
        retryLastTxsUnshieldCentralized();
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const debounceOnRefresh = debounce(onRefresh, 300);

  useFocusEffect(
    React.useCallback(() => {
      debounceOnRefresh();
    }, [signPublicKeyEncode, unshieldStorage, debounceOnRefresh]),
  );

  return (
    <WrappedComp
      {...{
        ...props,
      }}
    />
  );
};
