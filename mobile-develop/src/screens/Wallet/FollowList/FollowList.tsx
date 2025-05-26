import { View } from '@components/core';
import { useIsFocused } from '@react-navigation/native';
import { navigateToWalletDetail } from '@src/router/NavigationServices';
import assetsWithRetry from '@src/screens/Assets/Assets.withRetry';
import ToastService from '@src/services/ToastService';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { actionLoadFollowBalance } from '@src/store/followList/functions';
import {
  followTokensWalletSelector,
  isFetchingSelector,
} from '@src/store/followList/selectors';
import { setSelectedPrivacy } from '@src/store/selectedPrivacy';
import { selectedPrivacyTokenID } from '@src/store/selectedPrivacy/selectors';
import { setToken } from '@src/store/token';
import { actionRemoveFollowToken, getPTokenList } from '@src/store/token/functions';
import { debounce } from 'lodash';
import React, { memo, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import BigList from 'react-native-big-list';
import { batch } from 'react-redux';
import WalletExtra from '../Home/Wallet.extra';
import WalletToken from '../Home/Wallet.token';

interface IFollowList {
  onRetrySubmitWithdraw: () => void;
}

const FollowList = ({ onRetrySubmitWithdraw }: IFollowList) => {
  const data = useDebounceSelector(followTokensWalletSelector);
  const isRefreshing = useDebounceSelector(isFetchingSelector);
  const selectPrivacyTokenID = useDebounceSelector(selectedPrivacyTokenID);

  const isFocused = useIsFocused();
  const refInit = React.useRef(false);

  const handleSelectToken = async (tokenId, balance) => {
    if (!tokenId) return;
    if (
      selectPrivacyTokenID &&
      selectPrivacyTokenID.toLowerCase() !== tokenId.toLowerCase()
    ) {
      // actionFreeHistory(); //TODO
    }
    setSelectedPrivacy(tokenId);
    navigateToWalletDetail({ tokenId });
    setTimeout(async () => {
      setToken({
        id: tokenId,
        amount: balance,
        loading: false,
      });
    }, 1500);
  };
  const handleRemoveToken = async tokenId => {
    actionRemoveFollowToken(tokenId);
    ToastService.show('Add coin again to restore balance.');
  };

  const renderItem = React.useCallback(
    ({ item }) => {
      const { id, amount, swipable } = item;
      return (
        <WalletToken
          tokenId={id}
          amount={amount}
          swipable={swipable}
          onPress={() => handleSelectToken(id, amount)}
          handleRemoveToken={() => handleRemoveToken(id)}
        />
      );
    },
    [selectPrivacyTokenID],
  );

  const onRefresh = () => {
    batch(() => {
      onRetrySubmitWithdraw();
      loadBalance();
    });
  };

  // debounce load balance
  const loadBalance = React.useCallback(debounce(() => {
    batch(() => {
      getPTokenList()
      actionLoadFollowBalance()
    });
  }, 1000), []);

  useEffect(() => {
    if (!refInit || !refInit.current) {
      refInit.current = true;
      return;
    }
    isFocused && loadBalance();
  }, [isFocused]);

  return (
    <View fullFlex borderTop>
      <WalletExtra />
      <BigList
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            tintColor="white"
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        itemHeight={75}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
export default assetsWithRetry(memo(FollowList));
