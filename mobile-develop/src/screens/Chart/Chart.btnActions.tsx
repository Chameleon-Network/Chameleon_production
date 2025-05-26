import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FONTS } from '@src/styles';
import { Row } from '@src/components/Row';
import ButtonTrade from '@src/components/Button/ButtonTrade';

const styled = StyleSheet.create({
  container: {},
  btnStyle: {
    height: 28,
    paddingHorizontal: 15,
  },
  titleStyle: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
  },
});

const BtnActions = () => {
  return (
    <View style={styled.container}>
      <Row
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <ButtonTrade
          title="Trade"
          btnStyle={{ ...styled.btnStyle, marginRight: 15 }}
          titleStyle={styled.titleStyle}
        />
        <ButtonTrade
          title="Invest more"
          btnStyle={styled.btnStyle}
          titleStyle={styled.titleStyle}
        />
      </Row>
    </View>
  );
};


export default React.memo(BtnActions);
