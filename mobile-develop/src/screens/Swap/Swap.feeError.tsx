import { Text } from '@src/components/core';
import { PRV } from '@src/constants/common';
import { navigateToChooseNetworkForShield } from '@src/router/NavigationServices';
import { useSelector } from '@src/store/getStore';
import { feeErorSelector, swapInfoSelector } from '@src/store/pdexV3/swap/selectors';
import { getPrivacyDataByTokenID } from '@src/store/selectedPrivacy/selectors';
import { COLORS, FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const styled = StyleSheet.create({
  container: {
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

const FeeError = () => {
  const swapInfo = useSelector(swapInfoSelector);
  const error = useSelector(feeErorSelector);
  const privacyPRVData = useSelector(getPrivacyDataByTokenID)(PRV.id);
  const { isFetching } = swapInfo;
  if (!error || isFetching) return null;

  const onMessagePress = () => {
    navigateToChooseNetworkForShield({ tokenSelected: privacyPRVData })
  };

  return (
    <View style={styled.container}>
      <Text style={styled.text} onPress={onMessagePress}>
        {`Your ${PRV.symbol} balance is insufficient.`}&nbsp;
        <Text style={[styled.text, { textDecorationLine: 'underline' }]}>
          Add funds
        </Text>
      </Text>
    </View>
  );
};

export default React.memo(FeeError);
