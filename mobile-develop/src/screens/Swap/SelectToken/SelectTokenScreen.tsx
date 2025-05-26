import { LoadingContainer, View } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import { searchTokenOnSwap } from '@services/api/token';
import PToken from '@src/models/pToken';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import { FONTS } from '@src/styles';
import { debounce, orderBy } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { change } from 'redux-form';
import Header from '@src/components/Header/Header';
import withLazy from '@src/components/LazyHoc/withLazy';
import ListAllToken3 from '@src/components/Token/ListAllToken3';
import TokenTrade1 from '@src/components/Token/TokenTrade1';
import { useNavigationParam } from '@src/hooks';
import { goBack } from '@src/router/NavigationServices';
import { defaultAccountSelector } from '@src/store/account/selectors';
import { formConfigs, RULE_SORT } from '@src/store/pdexV3/swap/constants';
import { actionFetchPairs, actionResetData } from '@src/store/pdexV3/swap/functions';
import { filterSwapableToken, getDefaultTokenListBySearch } from '@src/store/pdexV3/swap/selectors';
import { addPToken } from '@src/store/token';
import { getBalance } from '@src/store/token/functions';
import { pTokenIdsSelector } from '@src/store/token/selectors';
import { delay } from '@src/utils';
import { styled } from './SelectionToken.styled';

const DEBOUNCE_TIME = 500;

const SelectTokenList = React.memo(() => {
  const dispatch = useDispatch();
  const data = useNavigationParam('data');
  const onPress = useNavigationParam('onPress');
  const { from: field, tokenId: currentTokenId } = data;
  const account = useSelector(defaultAccountSelector);
  const pTokenIdsList = useSelector(pTokenIdsSelector);
  const filterSwapableTokenFn = useSelector(filterSwapableToken);

  if (!field || !currentTokenId) return null;

  const availableTokens =
    useSelector(getDefaultTokenListBySearch)(currentTokenId) || [];

  const availableTokensSorted = useMemo(
    () => orderBy(availableTokens, RULE_SORT.key, RULE_SORT.value),
    [],
  );

  const [isLoading, setLoading] = useState(false);
  const [tokenList, setTokenList] = useState(availableTokensSorted);

  //Use Dic to save pToken List (key: tokenId, value: pToken)
  let pTokenDic;

  const wrapData = useCallback((tokens) => {
    let newTokensList = [];
    pTokenDic = {};
    newTokensList =
      tokens?.map((token) => {
        const newPToken = new PToken(token, tokens);
        pTokenDic[newPToken.tokenId] = newPToken;
        return newPToken;
      }) || [];
    newTokensList = newTokensList?.map((token) => {
      return new SelectedPrivacy(account, {}, token, token.tokenId);
    });
    return newTokensList;
  }, []);

  const isExistToken = useCallback(
    (tokenId) => {
      return pTokenIdsList.find((pTokenId) => pTokenId === tokenId);
    },
    [pTokenIdsList],
  );

  const debounceSearch = debounce(async (keySearch) => {
    if (!keySearch || keySearch.length < 1) {
      setTokenList(availableTokens);
    } else {
      setLoading(true);
      const data = await searchTokenOnSwap(keySearch);
      const result = wrapData(data);
      if (result && result.length < 1) {
        setTokenList([]);
      } else {
        //filter token with verified = true
        let filterTokenVerifed = result.filter((token) => !!token.isVerified);

        //filter swappable
        filterTokenVerifed = filterSwapableTokenFn(
          currentTokenId,
          field,
          filterTokenVerifed,
        );

        //Sort result final
        setTokenList(
          orderBy(filterTokenVerifed, RULE_SORT.key, RULE_SORT.value),
        );
      }
      setLoading(false);
    }
    setLoading(false);
  }, DEBOUNCE_TIME);

  const renderItem = useCallback(
    ({ item }) => (
      <TokenTrade1
        item={item}
        onPress={async () => {
          goBack();
          const tokenId = item.tokenId;
          if (!isExistToken(tokenId)) {
            batch(() => {
              getBalance(tokenId)
              addPToken(pTokenDic[tokenId])
              actionFetchPairs(true)
            });
          }
          actionResetData()
          dispatch(change(formConfigs.formName, formConfigs.feetoken, ''));
          await delay(0);
          if (typeof onPress === 'function') {
            onPress(item);
          }
        }}
        tokenId={item?.tokenId}
      />
    ),
    [],
  );

  return (
    <View2 style={styled.container}>
      <Header
        title="Select coins"
        canSearch
        titleStyled={FONTS.TEXT.incognitoH4}
        isNormalSearch
        onTextSearchChange={(value) => {
          debounceSearch(value);
        }}
      />
      <View borderTop style={[{ flex: 1 }]}>
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <ListAllToken3 tokensFactories={tokenList} renderItem={renderItem} />
        )}
      </View>
    </View2>
  );
});

export default withLazy(SelectTokenList);
