import React from 'react';
import { StyleSheet } from 'react-native';
import { FONTS } from '@src/styles';
import { useFaucet } from '@src/components/Modal/features/FaucetPRVModal';
import { Text } from '../core';

const styled = StyleSheet.create({
  subText: {
    fontSize: FONTS.SIZE.superSmall,
    fontFamily: FONTS.NAME.regular,
    textAlign: 'center',
  },
  topup: {
    fontSize: FONTS.SIZE.superSmall,
    fontFamily: FONTS.NAME.medium,
    textDecorationLine: 'underline',
  },
});

const NetworkFee = ({ style, feeStr = '0.0000001' }: { style?: any, feeStr: string | number }) => {
  const [navigateFaucet] = useFaucet();
  return (
    <Text style={[styled.subText, style]}>
      {
        feeStr
          ? `Incognito collects a small network fee of ${feeStr} PRV to pay the miners who help power the network. Get some from the `
          : 'Incognito collects a small network fee of PRV to pay the miners\nwho help power the network. Get some from the '
      }
      <Text style={styled.topup} onPress={navigateFaucet}>
        faucet.
      </Text>
    </Text>
  );
};

export default React.memo(NetworkFee);
