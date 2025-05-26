import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@src/components/core';
import { FONTS, COLORS } from '@src/styles';
import { useFaucet } from '@src/components/Modal/features/FaucetPRVModal';
import { getEsimateTradeError, inputAmountSelector, validatePRVNetworkFee } from '@src/store/pdexV3/swap/selectors';
import { useSelector } from '@src/store/getStore';
import { formConfigs } from '@src/store/pdexV3/swap/constants';

const styled = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 0,
  },
  text: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    color: COLORS.red,
    marginRight: 5,
  },
});

const EstimateTradeError = () => {
  const error = useSelector(getEsimateTradeError);
  const [navigateFaucet] = useFaucet();
  const errorNetworkFeeMessage = useSelector(validatePRVNetworkFee);
  const inputAmount = useSelector(inputAmountSelector);
  const sellInputAmount = inputAmount(formConfigs.selltoken);
  const { amountText } = sellInputAmount;
  if (!error && !errorNetworkFeeMessage) return null;

  // if (!error) return null;
  if (error) {
    return (
      <View style={styled.container}>
        <Text style={styled.text}>{error}</Text>
      </View>
    );
  }

  // estimate done = amountText have a value!
  if (errorNetworkFeeMessage && amountText && amountText.length > 0) {
    return (
      <View style={styled.container}>
        <Text style={styled.text}>
          {errorNetworkFeeMessage}
          <Text
            style={[styled.text, { textDecorationLine: 'underline' }]}
            onPress={() => {
              navigateFaucet();
            }}
          >
            Faucet.
          </Text>
        </Text>
      </View>
    );
  }
  return null;
};

export default React.memo(EstimateTradeError);
