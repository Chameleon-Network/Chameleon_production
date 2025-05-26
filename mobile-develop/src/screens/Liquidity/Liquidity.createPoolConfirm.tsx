import React, {memo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {withTransaction} from './Liquidity.enhanceTransaction';
import {
  ampValueSelector,
  feeAmountSelector,
  inputAmountSelector,
} from '@src/store/pdexV3/liquidity/createPoolSelector';
import {formConfigsCreatePool, LIQUIDITY_MESSAGES} from '@src/store/pdexV3/liquidity/constants';
import Header from '@src/components/Header/Header';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import globalStyled from '@src/theme/theme.styled';
import {COLORS, FONTS} from '@src/styles';
import {Extra} from './Liquidity.createPool';

interface ConfirmProps {
  onCreateNewPool?: () => void;
  error?: string;
}

const Confirm = ({onCreateNewPool, error}: ConfirmProps) => {
  const amountSelector = useSelector(inputAmountSelector);
  const inputAmount = amountSelector(
    formConfigsCreatePool.formName,
    formConfigsCreatePool.inputToken,
  );
  const outputAmount = amountSelector(
    formConfigsCreatePool.formName,
    formConfigsCreatePool.outputToken,
  );
  const {feeAmount} = useSelector(feeAmountSelector);
  const {amp} = useSelector(ampValueSelector);
  const createNewPool = async () => {
    if (typeof onCreateNewPool !== 'function') return;
    onCreateNewPool({
      fee: feeAmount / 2,
      tokenId1: inputAmount.tokenId,
      tokenId2: outputAmount.tokenId,
      amount1: inputAmount.originalInputAmount,
      amount2: outputAmount.originalInputAmount,
      amp,
    });
  };

  return (
    <View style={mainStyle.container}>
      <Header title={LIQUIDITY_MESSAGES.createPool} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={mainStyle.mainInfo}>
          <Text style={mainStyle.bigText}>Add</Text>
          <Text
            style={
              mainStyle.bigText
            }>{`${inputAmount.inputAmountSymbolStr} + ${outputAmount.inputAmountSymbolStr}`}</Text>
        </View>
        <Extra />
        {!!error && <Text style={mainStyle.error}>{error}</Text>}
        <ButtonTrade
          btnStyle={mainStyle.button}
          title={LIQUIDITY_MESSAGES.createPool}
          onPress={createNewPool}
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
