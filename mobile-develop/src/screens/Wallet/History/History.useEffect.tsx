import {removeHistory} from '@src/services/api/history';
import {ExHandler} from '@src/services/exception';
import ToastService from '@src/services/ToastService';
import {getBalance as getAccountBalance} from '@src/store/account';
import {
  defaultAccountSelector,
  signPublicKeyEncodeSelector,
} from '@src/store/account/selectors';
import {actionFetch as actionFetchHistory} from '@src/store/history/functions';
import {selectedPrivacy as selectedPrivacySelector} from '@src/store/selectedPrivacy/selectors';
import {getBalance as getTokenBalance} from '@src/store/token/functions';
import {PrivacyVersion} from 'incognito-chain-web-js/build/wallet';
import React from 'react';
import {batch, useSelector} from 'react-redux';

export const useHistoryEffect = (props?: {version?: PrivacyVersion}) => {
  const {version = PrivacyVersion.ver2} = props || {};
  const account = useSelector(defaultAccountSelector);
  const selectedPrivacy = useSelector(selectedPrivacySelector);
  const signPublicKeyEncode = useSelector(signPublicKeyEncodeSelector);
  const handleRefresh = async (shouldLoadBalance = true) => {
    try {
      batch(() => {
        if (shouldLoadBalance) {
          switch (version) {
            case PrivacyVersion.ver2: {
              if (selectedPrivacy.isMainCrypto) {
                getAccountBalance(account);
              } else if (selectedPrivacy.isToken) {
                getTokenBalance(selectedPrivacy.tokenId);
              }
              break;
            }
            default:
              break;
          }
        }
        actionFetchHistory({version});
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleCancelEtaHistory = async history => {
    try {
      const data = await removeHistory({
        historyId: history?.id,
        currencyType: history?.currencyType,
        isDecentralized: history?.decentralized,
        signPublicKeyEncode,
      });
      if (data) {
        ToastService.show('Canceled');
        actionFetchHistory({version});
      }
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  };
  React.useEffect(() => {
    handleRefresh(false);
  }, []);
  return {
    handleRefresh,
    handleCancelEtaHistory,
  };
};
