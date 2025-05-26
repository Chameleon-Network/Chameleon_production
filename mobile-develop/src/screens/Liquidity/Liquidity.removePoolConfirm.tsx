import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import { FONTS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import { COLORS } from '@src/styles';
import { useSelector } from '@src/store/getStore';
import { feeAmountSelector, inputAmountSelector, poolIDSelector, shareDataSelector } from '@src/store/pdexV3/liquidity/removePoolSelector';
import { formConfigsRemovePool, LIQUIDITY_MESSAGES } from '@src/store/pdexV3/liquidity/constants';
import Header from '@src/components/Header/Header';
import { Extra } from './Liquidity.removePool';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import { withTransaction } from './Liquidity.enhanceTransaction';

interface ConfirmProps {
  onRemoveContribute: (params: any) => void;
  error: string;
}

const Confirm = ({ onRemoveContribute, error }: ConfirmProps) => {
  const amountSelector = useSelector(inputAmountSelector);
  const { feeAmount } = useSelector(feeAmountSelector);
  const poolId = useSelector(poolIDSelector);
  const { nftId } = useSelector(shareDataSelector);
  const inputAmount = amountSelector(formConfigsRemovePool.formName, formConfigsRemovePool.inputToken);
  const outputAmount = amountSelector(formConfigsRemovePool.formName, formConfigsRemovePool.outputToken);
  const removeContributes = async () => {
    if (typeof onRemoveContribute !== 'function') return;
    onRemoveContribute({
      fee: feeAmount,
      poolTokenIDs: [inputAmount?.tokenId, outputAmount?.tokenId],
      poolPairID: poolId,
      shareAmount: inputAmount?.withdraw,
      nftID: nftId,
    });
  };
  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.removePool} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={mainStyle.mainInfo}>
          <Text style={mainStyle.bigText}>Remove</Text>
          <Text style={mainStyle.bigText}>{`${inputAmount?.inputAmountSymbolStr} + ${outputAmount?.inputAmountSymbolStr}`}</Text>
        </View>
        <Extra />
        {!!error && <Text style={mainStyle.error}>{error}</Text>}
        <ButtonTrade
          btnStyle={mainStyle.button}
          title={LIQUIDITY_MESSAGES.removePool}
          onPress={removeContributes}
        />
      </ScrollView>
    </View>
  );
};

export default withTransaction(memo(Confirm));

const mainStyle = StyleSheet.create({
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
    borderRadius: 8,
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
    marginTop: 25,
  },
  tab1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...globalStyled.defaultPaddingHorizontal,
    paddingBottom: 16,
  },
  styledTabList1: {},
});
