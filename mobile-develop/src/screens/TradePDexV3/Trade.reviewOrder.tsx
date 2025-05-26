import ButtonTrade from '@src/components/Button/ButtonTrade';
import ScrollView from '@src/components/core/ScrollView/Component';
import Header from '@src/components/Header/Header';
import {COLORS} from '@src/styles';
import React from 'react';
import {View, StyleSheet} from 'react-native';

const styled = StyleSheet.create({
  container: {flex: 1},
  btnStyled: {
    marginTop: 30,
  },
  scrollview: {
    paddingTop: 32,
    flex: 1,
  },
});

interface ReviewOrderProps {
  extra: React.ReactNode;
  handleConfirm: () => void;
  btnColor?: string;
  loadingTx: boolean;
}

const ReviewOrder = (props: ReviewOrderProps) => {
  const {
    extra,
    handleConfirm,
    btnColor = COLORS.colorTradeBlue,
    loadingTx,
  } = props;
  return (
    <View style={styled.container}>
      <Header title="Order preview" />
      <ScrollView style={styled.scrollview}>
        {extra && extra}
        <ButtonTrade
          btnStyle={{...styled.btnStyled, backgroundColor: btnColor}}
          title="Confirm"
          onPress={handleConfirm}
        />
      </ScrollView>
      {loadingTx && <loadingTx />}
    </View>
  );
};

export default React.memo(ReviewOrder);
