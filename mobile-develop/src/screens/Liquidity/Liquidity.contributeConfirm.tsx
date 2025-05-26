import { useSelector } from '@src/store/getStore';
import { formConfigsContribute, LIQUIDITY_MESSAGES } from '@src/store/pdexV3/liquidity/constants';
import { feeAmountSelector, inputAmountSelector, mappingDataSelector, poolIDSelector } from '@src/store/pdexV3/liquidity/contributeSelector';
import { COLORS, FONTS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { withTransaction } from './Liquidity.enhanceTransaction';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import { Extra } from './Liquidity.contribute';
import Header from '@src/components/Header/Header';

interface ConfirmProps {
  onCreateContributes?: (params: any) => void;
  error?: string;
}

const Confirm = React.memo(({ onCreateContributes, error }: ConfirmProps) => {
  const amountSelector = useSelector(inputAmountSelector);
  const inputAmount = amountSelector(formConfigsContribute.formName, formConfigsContribute.inputToken);
  const outputAmount = amountSelector(formConfigsContribute.formName, formConfigsContribute.outputToken);
  const { feeAmount } = useSelector(feeAmountSelector);
  const poolId = useSelector(poolIDSelector);
  const { amp, nftId } = useSelector(mappingDataSelector);
  const createContributes = async () => {
    if (typeof onCreateContributes !== 'function') return;
    onCreateContributes({
      fee: feeAmount / 2,
      tokenId1: inputAmount?.tokenId,
      tokenId2: outputAmount?.tokenId,
      amount1: inputAmount?.originalInputAmount,
      amount2: outputAmount?.originalInputAmount,
      poolPairID: poolId,
      amp,
      nftId,
    });
  };

  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.addLiquidity} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={mainStyle.mainInfo}>
          <Text style={mainStyle.bigText}>Add</Text>
          <Text style={mainStyle.bigText}>{`${inputAmount?.inputAmountSymbolStr} + ${outputAmount?.inputAmountSymbolStr}`}</Text>
        </View>
        <Extra />
        {!!error && <Text style={mainStyle.error}>{error}</Text>}
        <ButtonTrade
          btnStyle={mainStyle.button}
          title={LIQUIDITY_MESSAGES.addLiquidity}
          onPress={createContributes}
        />
      </ScrollView>
    </View>
  );
});

export default withTransaction(Confirm);

export const mainStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flex: 1,
  },
  fullFlex: {
    flex: 1,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
    height: 50,
    borderRadius: 8
  },
  scrollView: {
    marginBottom: 70,
  },
  mainInfo: {
    marginVertical: 20,
  },
  bigText: {
    ...FONTS.STYLE.bold,
    color: COLORS.colorTradeBlue,
    fontSize: 35,
    lineHeight: 45,
  },
  error: {
    color: COLORS.red,
    lineHeight: 22,
  },
  extra: {
    marginTop: 25
  },
  tab1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...globalStyled.defaultPaddingHorizontal,
    paddingBottom: 16
  },
  styledTabList1: {
  },
});
