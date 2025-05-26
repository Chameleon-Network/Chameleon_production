import { ExHandler } from '@services/exception';
import getStore from '../getStore';
import { syncPairlist } from '.';
import { defaultAccountWalletSelector } from '../account/selectors';
import { getPDexV3Instance } from '../pdexV3/functions';

export const requestFetchPairs = async () => {
    try {
        const state = getStore().getState();
        const account = defaultAccountWalletSelector(state);
        const pDexV3Inst = await getPDexV3Instance({ account });
        const pairs = await pDexV3Inst.getListPair();
        if (pairs) {
            syncPairlist({ pairs });
        }
    } catch (error) {
        new ExHandler(error).showErrorToast();
    }
};