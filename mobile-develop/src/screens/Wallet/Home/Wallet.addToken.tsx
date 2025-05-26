import React, {memo} from 'react';
import { TouchableOpacity } from '@components/core';
import {styledAddToken} from './Wallet.styled';
import { navigateToFollowToken } from '@src/router/NavigationServices';
import { AddCoinIcon } from '@src/components/Icons';

const WalletAddToken = () => {
  const handleFollowToken = () => navigateToFollowToken();
  return (
    <TouchableOpacity style={styledAddToken.container} onPress={handleFollowToken}>
      <AddCoinIcon />
    </TouchableOpacity>
  );
};

export default memo(WalletAddToken);
