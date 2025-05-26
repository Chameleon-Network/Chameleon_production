import {ExHandler} from '@src/services/exception';
import {PrivacyVersion} from 'incognito-chain-web-js/build/wallet';
import {batch} from 'react-redux';
import {PRV_ID} from '@screens/Dex/constants';
import cloneDeep from 'lodash/cloneDeep';
import {getDefaultAccountWalletSelector} from '../shared/selectors';
import {
  actionFetchedAllTXSStreamline,
  actionFetchedStreamline,
  actionFetchedUTXOSStreamline,
  actionFetchingStreamline,
  actionFetchingUTXOSStreamline,
} from '.';
import getStore from '../getStore';
import {switchAccountSelector} from '../account/selectors';
import {selectedPrivacy as selectedPrivacySelector} from '../selectedPrivacy/selectors';
import {streamlineSelector} from './selectors';
import {tokensFollowedSelector} from '../token/selectors';

export const actionFetch = async () => {
  let error;
  try {
    const state = getStore().getState();
    const accountWallet = getDefaultAccountWalletSelector(state);
    const selectedPrivacy = selectedPrivacySelector(state);
    const {isFetching} = streamlineSelector(state);

    if (isFetching) return;

    actionFetchingStreamline();

    const address = accountWallet?.getPaymentAddress();
    const tokenID = selectedPrivacy?.tokenId;
    const result = await accountWallet.consolidate({
      transfer: {tokenID},
      extra: {version: PrivacyVersion.ver2},
    });

    if (result) {
      const payload = {
        address,
        utxos: result?.map(item => item?.txId),
        tokenID,
      };
      actionFetchedStreamline(payload);
    }
  } catch (e) {
    error = e;
    if (
      error &&
      error?.code === 'WEB_JS_ERROR(-3002)' &&
      error?.stackTraceCode === ''
    ) {
      error = new Error('Something’s not quite right. Please try again later.');
      return new ExHandler(error).showErrorToast();
    }
    new ExHandler(error).showErrorToast(true);
  } finally {
    actionFetchedAllTXSStreamline();
  }
};

export const actionConditionConsolidate = async ({
  version = PrivacyVersion.ver2,
} = {}) => {
  try {
    const state = getStore().getState();
    const switchingAccount = switchAccountSelector(state);
    if (switchingAccount) return;
    /** start fetching UTXOS */
    actionFetchingUTXOSStreamline(true);
    const accountWallet = getDefaultAccountWalletSelector(state);
    let followed = cloneDeep(tokensFollowedSelector(state));
    const address = accountWallet?.getPaymentAddress();
    followed = [{id: PRV_ID}].concat(followed);
    await accountWallet.getCoinsInMempoolCached();
    const tasks = followed.map(async ({id: tokenID}) => {
      const unspentCoins =
        (await accountWallet.getUnspentCoinsExcludeSpendingCoins({
          tokenID,
          version,
        })) || [];
      return {
        tokenID,
        address,
        unspentCoins,
      };
    });
    const newUTXOS = (await Promise.all(tasks)).filter(item => !!item);
    batch(() => {
      actionFetchingUTXOSStreamline(false);
      actionFetchedUTXOSStreamline(newUTXOS);
    });
  } catch (e) {
    actionFetchingUTXOSStreamline(false);
    console.log('actionConditionConsolidate error: ', e);
  }
};
