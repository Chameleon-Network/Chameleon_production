import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from '@src/components/core';
import {Text4} from '@src/components/core/Text';
import {FONTS} from '@src/styles';

const styled = StyleSheet.create({
  hook: {
    marginBottom: 30,
  },
  value: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
  },
});

interface HookProps {
  value: string;
}

const Hook = (props: HookProps) => {
  const {value} = props;
  return (
    <View style={styled.hook}>
      <Text4 style={styled.value}>{value}</Text4>
    </View>
  );
};

export default React.memo(Hook);
