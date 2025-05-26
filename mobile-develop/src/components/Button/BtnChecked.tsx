import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CheckBoxIcon } from '../Icons';

const styled = StyleSheet.create({
  btnStyle: {},
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const BtnBack = (props) => {
  const { btnStyle, checked, hook, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...rest}>
      <View style={styled.row}>
        <CheckBoxIcon active={checked} />
        {hook}
      </View>
    </TouchableOpacity>
  );
};

export default BtnBack;
