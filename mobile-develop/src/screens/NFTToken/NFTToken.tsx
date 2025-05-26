import { useFocusEffect } from '@react-navigation/native';
import CopiableText from '@src/components/CopiableText';
import Header from '@src/components/Header/Header';
import { Text, View } from '@src/components/core';
import { ScrollViewBorder } from '@src/components/core/ScrollView';
import { actionSetNFTTokenData } from '@src/store/account/functions';
import { nftTokenDataSelector } from '@src/store/account/selectors';
import React from 'react';
import NFTTokenHook from './NFTToken.hook';
import { FormMint } from './NFTToken.mint';
import { styled } from './NFTToken.styled';
import { useSelector } from '@src/store/getStore';

interface NFTTokenItemProps {
  nftToken: string;
  amount: string;
}

const NFTTokenItem = React.memo((props: NFTTokenItemProps) => {
  const {nftToken = '', amount = '0'} = props;
  if (!nftToken) {
    return null;
  }
  return (
    <CopiableText
      text={JSON.stringify({nftToken, amount})}
      copiedMessage="Copied"
      style={styled.nftTokenItemContainer}>
      <Text ellipsizeMode="middle" numberOfLines={1} style={styled.nftToken}>
        {nftToken}
      </Text>
    </CopiableText>
  );
});

const ListNFTToken = React.memo(() => {
  const {list} = useSelector(nftTokenDataSelector);
  if (list.length === 0) {
    return null;
  }
  return (
    <View style={styled.list}>
      <Text style={styled.listTitle}>Your tickets</Text>
      {list.map(nft => (
        <NFTTokenItem {...nft} key={nft?.nftToken} />
      ))}
    </View>
  );
});

const NFTTokenScreen = props => {
  useFocusEffect(
    React.useCallback(() => {
      actionSetNFTTokenData();
    }, []),
  );
  const hookFactories = React.useMemo(
    () => [
      {
        value:
          'Tickets play a special role on pDEX. They allow you to perform actions like placing limit orders and investing in pools. They also act as receipts for those actions. With these tickets, you are able to withdraw the liquidity you provided, or cancel your limit order before it fills.',
      },
      {
        value:
          "A ticket is freed up once an action is complete. If you wish to make multiple transactions at the same time, you will be prompted to mint more tickets. You don't have to keep track of them, and you can mint as many as you like.",
      },
    ],
    [],
  );
  return (
    <>
      <Header title="Tickets" />
      <ScrollViewBorder style={styled.scrollview}>
        {hookFactories.map(hook => (
          <NFTTokenHook {...hook} key={hook.label} />
        ))}
        <ListNFTToken />
        <FormMint />
      </ScrollViewBorder>
    </>
  );
};

export default React.memo(NFTTokenScreen);
