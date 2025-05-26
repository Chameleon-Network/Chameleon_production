import {storage} from '@src/services';
import {getToken} from '@src/services/auth';
import Server from '@src/services/wallet/Server';
import {PDexV3} from 'incognito-chain-web-js/build/wallet';
import {defaultAccountWalletSelector} from '../account/selectors';
import getStore from '../getStore';

export const getPDexV3Instance = async ({account = {}} = {}) => {
  try {
    const server = await Server.getDefault();
    let pDexV3Inst = new PDexV3();
    const authToken = await getToken();
    if (account) {
      pDexV3Inst.setAccount(account);
    }
    pDexV3Inst.setAuthToken(authToken);
    pDexV3Inst.setRPCTradeService(server.tradeServices);
    pDexV3Inst.setRPCCoinServices(server.coinServices);
    pDexV3Inst.setStorageServices(storage);
    pDexV3Inst.setRPCTxServices(server.pubsubServices);
    pDexV3Inst.setRPCApiServices(server.apiServices);
    pDexV3Inst.setRPCWebAppService(server.webAppService);
    return pDexV3Inst;
  } catch (error) {
    console.log('getPDexV3Instance-error', error);
  }
};

export const actionGetPDexV3Inst = async () => {
  const state = getStore().getState();
  const account = defaultAccountWalletSelector(state);
  const pDexV3 = await getPDexV3Instance({account});
  return pDexV3;
};
