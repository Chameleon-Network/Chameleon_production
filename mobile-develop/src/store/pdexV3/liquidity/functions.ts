import { batch } from 'react-redux';
import { ExHandler } from '@services/exception';
import uniq from 'lodash/uniq';
import { change } from 'redux-form';
import BigNumber from 'bignumber.js';
import format from '@utils/format';
import { debounce } from 'lodash';
import { createPoolTokenLiquidityPdexV3, fetchingContributeDataLiquidityPdexV3, freeCreatePoolTokenLiquidityPdexV3, freeLiquidityPdexV3, setContributeIdLiquidityPdexV3, setContributePoolDataLiquidityPdexV3, setFetchingCraetePoolLiquidityPdexV3, setFocusCreatePoolLiquidityPdexV3, setRateCreatePoolLiquidityPdexV3, setRemovePoolTokenLiquidityPdexV3, setRemoveShareIdLiquidityPdexV3, setTypingCreatePoolLiquidityPdexV3 } from '.';
import { getBalance } from '@src/store/token/functions';
import getStore from '@src/store/getStore';
import { mappingDataSelector, poolIDSelector, statusSelector } from './contributeSelector';
import { defaultAccountWalletSelector } from '@src/store/account/selectors';
import { actionGetPDexV3Inst, getPDexV3Instance } from '../functions';
import { actionSetNFTTokenData } from '@src/store/account/functions';
import { calculateContributeValue, parseInputWithText } from '../utils';
import { formConfigsContribute, formConfigsCreatePool, formConfigsRemovePool } from './constants';
import { focusFieldSelector, isFetchingSelector, tokenSelector } from './createPoolSelector';
import { allTokensIDsSelector } from '@src/store/token/selectors';
import { listPoolsPureSelector } from '../pools/selectors';
import { filterTokenList } from './utils';
import { actionFetch as actionFetchPortfolio } from '../portforlio/functions';
import removePoolSelector from './removePoolSelector';
import { toHumanAmount } from '@src/utils/common';

/***
 *================================================================
 *==========================CONTRIBUTE============================
 *================================================================
 **/
export const actionFetchingContribute = ({ isFetching }: { isFetching: boolean }) => fetchingContributeDataLiquidityPdexV3({ isFetching })

export const actionSetContributeID = ({ poolId, nftId }: { poolId: string, nftId: string }) => setContributeIdLiquidityPdexV3({ poolId, nftId })

export const actionSetContributePoolData = ({ data, inputToken, outputToken }: { data: any, inputToken: any, outputToken: any }) => setContributePoolDataLiquidityPdexV3({ data, inputToken, outputToken })

export const actionGetBalance = async (tokenIDs = []) => {
    try {
        tokenIDs = uniq(tokenIDs);
        tokenIDs.forEach((tokenID) => {
            getBalance(tokenID)
        });
    } catch (error) {
        new ExHandler(error).showErrorToast();
    }
};

export const actionInitContribute = async () => {
    try {
        const state = getStore().getState();
        const isFetching = statusSelector(state);
        if (isFetching) return;
        actionFetchingContribute({ isFetching: true })
        const poolID = poolIDSelector(state);
        const account = defaultAccountWalletSelector(state);
        const pDexV3Inst = await getPDexV3Instance({ account });
        const [poolDetails] = await Promise.all([
            (await pDexV3Inst.getListPoolsDetail([poolID])) || [],
            await actionSetNFTTokenData()
        ]);
        if (poolDetails.length > 0) {
            const contributePool = poolDetails[0];
            if (!contributePool) return;
            const { token1Id, token2Id } = contributePool;
            batch(() => {
                actionSetContributePoolData({
                    data: contributePool,
                    inputToken: token1Id,
                    outputToken: token2Id,
                })
                actionGetBalance([token1Id, token2Id])
            });
        }
    } catch (error) {
        new ExHandler(error).showErrorToast();
    } finally {
        actionFetchingContribute({ isFetching: false })
    }
};

export const actionChangeInputContribute = async (newInput) => {
        try {
            const state = getStore().getState();
            const { inputToken, outputToken, token1PoolValue, token2PoolValue } =
                mappingDataSelector(state);
            const inputValue = parseInputWithText({
                text: newInput,
                token: inputToken,
            });
            const outputText = calculateContributeValue({
                inputValue,
                outputToken,
                inputToken,
                inputPool: token1PoolValue,
                outputPool: token2PoolValue,
            });
            batch(() => {
                change(
                    formConfigsContribute.formName,
                    formConfigsContribute.inputToken,
                    newInput,
                )
                change(
                    formConfigsContribute.formName,
                    formConfigsContribute.outputToken,
                    outputText,
                )
            });
        } catch (error) {
            new ExHandler(error).showErrorToast();
        }
    };

export const actionChangeOutputContribute =
    async (newOutput) => {
        try {
            const state = getStore().getState();
            const { inputToken, outputToken, token1PoolValue, token2PoolValue } =
                mappingDataSelector(state);
            const outputValue = parseInputWithText({
                text: newOutput,
                token: outputToken,
            });
            const inputText = calculateContributeValue({
                inputValue: outputValue,
                outputToken: inputToken,
                inputToken: outputToken,
                inputPool: token2PoolValue,
                outputPool: token1PoolValue,
            });
            batch(() => {
                change(
                    formConfigsContribute.formName,
                    formConfigsContribute.inputToken,
                    inputText,
                )
                change(
                    formConfigsContribute.formName,
                    formConfigsContribute.outputToken,
                    newOutput,
                )
            });
        } catch (error) {
            new ExHandler(error).showErrorToast();
        }
    };

/***
 *================================================================
 *==========================Create Pool============================
 *================================================================
 **/
export const actionSetCreatePoolToken = (payload) => createPoolTokenLiquidityPdexV3(payload);

export const actionFeeCreatePool = () => freeCreatePoolTokenLiquidityPdexV3();

export const actionSetFetchingCreatePool = ({ isFetching }: { isFetching: boolean }) => setFetchingCraetePoolLiquidityPdexV3({ isFetching });

export const actionSetTypingCreatePool = ({ isTyping }: { isTyping: boolean }) => setTypingCreatePoolLiquidityPdexV3({ isTyping });

export const actionSetFocusCreatePool = ({ focusField }: { focusField: string }) => setFocusCreatePoolLiquidityPdexV3({ focusField });

export const actionSetRateCreatePool = ({ rate, amp }: { rate: number, amp: number }) => setRateCreatePoolLiquidityPdexV3({ rate, amp });

export const debouncedGetCreatePoolRate = debounce(async (dispatch, _, payload) => {
    try {
        const { inputToken, inputAmount, outputToken, outputAmount } = payload;
        const pDexV3Inst = await actionGetPDexV3Inst()
        const data = await pDexV3Inst.rpcTradeService.apiCheckRate({
            token1: inputToken,
            token2: outputToken,
            amount1: inputAmount,
            amount2: outputAmount,
        });
        if (!data) return;
        let { maxAmp, rate } = data;
        maxAmp = new BigNumber(maxAmp).multipliedBy(1e4).toNumber();
        actionSetRateCreatePool({ rate, amp: maxAmp })
    } catch (error) {
        new ExHandler(error).showErrorToast();
    } finally {
        actionSetTypingCreatePool({ isTyping: false })
    }
}, 1000);

export const asyncActionDebounced = (payload, closure) => closure(payload);

export const actionSetCreatePoolText = async (text) => {
    try {
        const state = getStore().getState();
        const field = focusFieldSelector(state);
        change(formConfigsCreatePool.formName, field, text)
    } catch (error) {
        new ExHandler(error).showErrorToast();
    }
};

export const actionUpdateCreatePoolInputToken = async (tokenId) => {
    try {
        const state = getStore().getState();
        const isFetching = isFetchingSelector(state);
        if (isFetching) return;
        actionSetFetchingCreatePool({ isFetching: true })
        const tokenIds = allTokensIDsSelector(state);
        const { inputToken, outputToken } =
            tokenSelector(state);
        const pools = listPoolsPureSelector(state);
        const newInputToken = tokenId;
        let newOutputToken = outputToken.tokenId;
        if (newInputToken === outputToken.tokenId) {
            newOutputToken = inputToken.tokenId;
        }
        const outputTokens = filterTokenList({
            tokenId: newInputToken,
            pools,
            tokenIds,
            ignoreTokens: [newInputToken],
        });
        const isExist = outputTokens.some(
            (tokenId) => tokenId === newOutputToken,
        );
        if (!isExist) newOutputToken = outputTokens[0];
        await Promise.all([
            actionSetCreatePoolToken({
                inputToken: newInputToken,
                outputToken: newOutputToken,
            }),
            actionGetBalance([newInputToken, newOutputToken])
        ]);
    } catch (error) {
        new ExHandler(error).showErrorToast();
    } finally {
        actionSetFetchingCreatePool({ isFetching: false })
    }
};

export const actionUpdateCreatePoolOutputToken = async (tokenId) => {
    try {
        const state = getStore().getState();
        const isFetching = isFetchingSelector(state);
        if (isFetching) return;
        actionSetFetchingCreatePool({ isFetching: true })
        const { inputToken, outputToken } =
            tokenSelector(state);
        const newOutputToken = tokenId;
        let newInputToken = inputToken.tokenId;
        if (newInputToken === outputToken.tokenId) {
            newInputToken = outputToken.tokenId;
        }
        batch(() => {
            actionSetCreatePoolToken({
                inputToken: newInputToken,
                outputToken: newOutputToken,
            })
            actionGetBalance([newInputToken, newOutputToken])
        });
    } catch (error) {
        new ExHandler(error).showErrorToast();
    } finally {
        actionSetFetchingCreatePool({ isFetching: false })
    }
};

export const actionInitCreatePool = async () => {
    try {
        const state = getStore().getState();
        const isFetching = isFetchingSelector(state);
        if (isFetching) return;
        actionSetFetchingCreatePool({ isFetching: true })
        const tokenIDs = allTokensIDsSelector(state);
        const listPools = listPoolsPureSelector(state);
        const { inputToken, outputToken } = tokenSelector(state);
        let newInputToken, newOutputToken;
        if (!inputToken && !outputToken) {
            newInputToken = tokenIDs[0];
            const outputTokens = filterTokenList({
                tokenId: newInputToken,
                pools: listPools,
                tokenIds: tokenIDs,
                ignoreTokens: [newInputToken],
            });
            newOutputToken = outputTokens[0];
        } else {
            newInputToken = inputToken.tokenId;
            newOutputToken = outputToken.tokenId;
        }
        await Promise.all([
            actionSetCreatePoolToken({
                inputToken: newInputToken,
                outputToken: newOutputToken,
            }),
            actionGetBalance([newInputToken, newOutputToken]),
            actionSetNFTTokenData()
        ]);
    } catch (error) {
        new ExHandler(error).showErrorToast();
    } finally {
        actionSetFetchingCreatePool({ isFetching: false })
    }
};

/***
 *================================================================
 *==========================Remove Pool============================
 *================================================================
 **/
// const actionFetchingRemovePool = ({ isFetching }) => ({
//     type: TYPES.ACTION_SET_REMOVE_FETCHING,
//     payload: { isFetching },
// });

export const actionSetRemoveShareID = (payload) => setRemoveShareIdLiquidityPdexV3(payload)

export const actionSetRemovePoolToken = ({ inputToken, outputToken }) => setRemovePoolTokenLiquidityPdexV3({ inputToken, outputToken })

export const actionInitRemovePool = async () => {
    try {
        const state = getStore().getState();
        // actionFetchingRemovePool({ isFetching: true })
        const { inputToken, outputToken } = removePoolSelector.tokenSelector(state);
        if (!inputToken || !outputToken) return;
        const tasks = [
            actionFetchPortfolio(),
            actionGetBalance([inputToken.tokenId, outputToken.tokenId]),
            actionSetNFTTokenData()
        ];
        await Promise.all(tasks);
    } catch (error) {
        new ExHandler(error).showErrorToast();
    } finally {
        // actionFetchingRemovePool({ isFetching: false })
    }
};

export const actionChangeInputRemovePool = async (newText: string) => {
    try {
        const state = getStore().getState();
        const { inputToken, outputToken } = removePoolSelector.tokenSelector(state);
        const maxShareData = removePoolSelector.maxShareAmountSelector(state);
        const { maxInputShare, maxOutputShare } = maxShareData;
        const inputValue = parseInputWithText({ text: newText, token: inputToken });
        const outputValue = new BigNumber(inputValue)
            .multipliedBy(maxOutputShare)
            .dividedBy(maxInputShare)
            .toNumber();
        const outputHumanValue = toHumanAmount(
            outputValue,
            outputToken.pDecimals,
        );
        const outputText = format.toFixed(outputHumanValue, outputToken.pDecimals);
        batch(() => {
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.inputToken,
                newText,
            );
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.outputToken,
                outputText,
            )
        });
    } catch (error) {
        new ExHandler(error).showErrorToast();
    }
};

export const actionChangeOutputRemovePool = async (newText) => {
    try {
        const state = getStore().getState();
        const { inputToken, outputToken } =
            removePoolSelector.tokenSelector(state);
        const maxShareData = removePoolSelector.maxShareAmountSelector(state);
        const { maxInputShare, maxOutputShare } = maxShareData;
        const outputValue = parseInputWithText({
            text: newText,
            token: outputToken,
        });
        const inputValue = new BigNumber(outputValue)
            .multipliedBy(maxInputShare)
            .dividedBy(maxOutputShare)
            .toNumber();
        const inputHumanValue = toHumanAmount(
            inputValue,
            inputToken.pDecimals,
        );
        const inputText = format.toFixed(inputHumanValue, inputToken.pDecimals);
        batch(() => {
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.inputToken,
                inputText,
            );
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.outputToken,
                newText,
            );
        });
    } catch (error) {
        new ExHandler(error).showErrorToast();
    }
};

export const actionMaxRemovePool = async () => {
    try {
        const state = getStore().getState();
        const maxShareData = removePoolSelector.maxShareAmountSelector(state);
        const { maxInputShareStr, maxOutputShareStr } = maxShareData;

        batch(() => {
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.inputToken,
                maxInputShareStr,
            );
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.outputToken,
                maxOutputShareStr,
            )
        });
    } catch (error) {
        new ExHandler(error).showErrorToast();
    }
};

export const actionChangePercentRemovePool = async (percent) => {
    try {
        const state = getStore().getState();
        const maxShareData = removePoolSelector.maxShareAmountSelector(state);
        const { inputToken, outputToken } =
            removePoolSelector.tokenSelector(state);
        const { maxInputHuman, maxOutputHuman } = maxShareData;

        const percentNum = 100;
        const inputHuman = new BigNumber(maxInputHuman)
            .multipliedBy(percent)
            .dividedBy(percent)
            .toNumber();
        const inputStr = format.toFixed(inputHuman, inputToken.pDecimals);

        const outputHuman = new BigNumber(maxOutputHuman)
            .multipliedBy(percent)
            .dividedBy(percent)
            .toNumber();
        const outputStr = format.toFixed(outputHuman, outputToken.pDecimals);
        batch(() => {
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.inputToken,
                inputStr,
            );
            change(
                formConfigsRemovePool.formName,
                formConfigsRemovePool.outputToken,
                outputStr,
            );
        });
    } catch (error) {
        new ExHandler(error).showErrorToast();
    }
};

export const actionFree = () => freeLiquidityPdexV3();