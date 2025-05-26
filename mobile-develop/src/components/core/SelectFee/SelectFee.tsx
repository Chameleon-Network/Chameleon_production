import {Text} from '@src/components/core/Text';
import {Row} from '@src/components/Row';
import {FONTS} from '@src/styles';
import React, {memo} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {useTheme} from 'styled-components/native';
import {v4} from 'uuid';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  symbol: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 5,
    textAlign: 'right',
    marginRight: 10,
  },
  tail: {
    marginRight: 0,
  },
});

const SelectFeeItem = props => {
  const {symbol, tokenId, isActived, tail, canSelected, ...rest} = props;
  const theme = useTheme();
  return (
    <TouchableWithoutFeedback {...rest}>
      <View style={[styled.feeItem, tail ? styled.tail : null]}>
        <Text
          style={[
            styled.symbol,
            tail && styled.tail,
            {color: isActived ? theme.mainText : theme.subText},
          ]}>
          {symbol}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const SelectFee = memo(props => {
  const {types = [], onChangeTypeFee, canSelected} = props;
  const onChangeFee = type => {
    if (!canSelected) {
      return;
    }
    const {actived} = type;
    if (actived) {
      return;
    }
    if (typeof onChangeTypeFee === 'function') {
      onChangeTypeFee(type);
    }
  };
  return (
    <Row style={styled.container}>
      {types.map((type, index) => (
        <SelectFeeItem
          key={`${v4()}-${type.symbol}-${type?.tokenId}-${index}`}
          {...{
            ...type,
            isActived: type?.actived,
            tail: index === types.length - 1,
            onPress: () => onChangeFee(type),
            canSelected,
          }}
        />
      ))}
    </Row>
  );
});
