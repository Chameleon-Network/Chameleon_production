import AddSolidIcon from '@components/Icons/icon.addSolid';
import { LoadingContainer, Text, Text3, TouchableOpacity, View } from '@src/components/core';
import { View2 } from '@src/components/core/View';

import globalStyled from '@src/theme/theme.styled';
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, orderBy } from 'lodash';
import { searchToken } from '@services/api/token';
import { styled } from './FollowToken.styled';
import { navigateToAddManually } from '@src/router/NavigationServices';
import TokenBasic from '@src/components/Token/Token.basic';
import { availableTokensSelector } from '@src/store/shared/selectors';
import { RULE_SORT } from '@src/store/pdexV3/swap/constants';
import { actionAddFollowToken, actionRemoveFollowToken, getPTokenListNoCache } from '@src/store/token/functions';
import Header from '@src/components/Header/Header';
import ListAllToken2 from '@src/components/Token/ListAllToken2';
import TokenFollow from '@src/components/Token/TokenFollow';
import withLazy from '@src/components/LazyHoc/withLazy';

const AddManually = () => {
  const title = 'Don\'t see your coin?';
  const handleAddTokenManually = () =>
   navigateToAddManually({ type: 'ERC20' });
  
  return (
    <View spaceBetween style={styled.addManually}>
      <Text3 style={styled.text}>{title}</Text3>
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={handleAddTokenManually}
      >
        <Text style={styled.text}>Add manually</Text>
        <View style={{ marginLeft: 8 }}>
          <AddSolidIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const Item = ({ item, handleToggleFollowToken }) =>
  React.useMemo(() => {
    return (
      <TokenBasic
        onPress={() => handleToggleFollowToken(item)}
        tokenId={item?.tokenId}
        name="displayName"
        symbol="pSymbol"
        shouldShowFollowed
      />
    );
  }, [item?.isFollowed]);

const FollowTokenList = React.memo((props) => {
  const dispatch = useDispatch();
  const availableTokensOriginal = useSelector(availableTokensSelector);

  const [isLoading, setLoading] = useState(false);
  const [availableTokens, setAvailableTokens] = useState(
    availableTokensOriginal,
  );
  const [showUnVerifiedTokens, setShowUnVerifiedTokens] = useState(false);
  let tokensFollowedDic = useMemo(() => {
    let dicHash = {};
    availableTokensOriginal
      .filter((token) => token.isFollowed)
      .map((token) => {
        dicHash[token.tokenId] = token;
      });
    return dicHash;
  }, []);

  const debounceSearch = debounce(async (nextValue) => {
    setShowUnVerifiedTokens(false);
    if (!nextValue || nextValue.length < 1) {
      setAvailableTokens(availableTokensOriginal);
    } else {
      setLoading(true);
      let result = (await searchToken(nextValue)) || [];
      setLoading(false);
      if (result && result.length < 1) {
        setAvailableTokens([]);
      } else {
        result = result.map((token) => {
          token.isFollowed = !!tokensFollowedDic[token.tokenId];
          return token;
        });
      }
      setAvailableTokens(orderBy(result, RULE_SORT.key, RULE_SORT.value));
    }
    setLoading(false);
  }, 500);

  const [verifiedTokens, unVerifiedTokens] = useMemo(() => {
    const resultFiltered = availableTokens.reduce(
      (result, token) => {
        token?.isVerified
          ? result.verifiedTokens.push(token)
          : result.unVerifiedTokens.push(token);
        return result;
      },
      {
        verifiedTokens: [],
        unVerifiedTokens: [],
      },
    );
    return [resultFiltered.verifiedTokens, resultFiltered.unVerifiedTokens];
  }, availableTokens);

  const onSetShowUnVerifiedTokens = () => {
    setShowUnVerifiedTokens(!showUnVerifiedTokens);
  };
  let tokens = [];
  if (availableTokens && availableTokens.length < 1) {
    tokens = [];
  } else if (!verifiedTokens && !unVerifiedTokens) {
    tokens = [];
  } else if (verifiedTokens && verifiedTokens.length < 1) {
    tokens = [unVerifiedTokens];
  } else if (unVerifiedTokens && unVerifiedTokens.length < 1) {
    tokens = [verifiedTokens];
  } else if (!showUnVerifiedTokens) {
    tokens = [verifiedTokens];
  } else if (showUnVerifiedTokens) {
    tokens = [verifiedTokens, unVerifiedTokens];
  }

  const handleToggleFollowToken = async (token) => {
    const tokenIndex = availableTokens.findIndex(
      (t) => t?.tokenId === token?.tokenId,
    );
    let tokens = [...availableTokens];
    try {
      if (!token?.isFollowed) {
        tokens[tokenIndex].isFollowed = true;
        setAvailableTokens(tokens);
        await actionAddFollowToken(token?.tokenId)
        setTimeout(() => {
          getPTokenListNoCache()
        }, 300);
        tokensFollowedDic[token.tokenId] = token;
      } else {
        tokens[tokenIndex].isFollowed = false;
        setAvailableTokens(tokens);
        actionRemoveFollowToken(token?.tokenId)
        delete tokensFollowedDic[token.tokenId];
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View2 style={styled.container}>
      <Header
        title="Add a coin"
        canSearch
        titleStyled={FONT.TEXT.incognitoH4}
        isNormalSearch
        onTextSearchChange={(value) => {
          debounceSearch(value);
        }}
      />
      <View borderTop style={[{ flex: 1 }]}>
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <ListAllToken2
            tokensFactories={tokens}
            styledCheckBox={globalStyled.defaultPaddingHorizontal}
            isShowUnVerifiedTokens={showUnVerifiedTokens}
            setShowUnVerifiedTokens={onSetShowUnVerifiedTokens}
            renderItem={({ item }) => (
              <TokenFollow
                item={item}
                handleToggleFollowToken={handleToggleFollowToken}
                onPress={() => handleToggleFollowToken(item)}
              />
            )}
          />
        )}
      </View>
      <AddManually />
    </View2>
  );
});

export default withLazy(FollowTokenList);
