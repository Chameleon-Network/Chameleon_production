import React, {memo} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {COLORS} from '@src/styles';

const imgEmptySrc = require('@assets/images/pdexv3/empty.png');
const styled = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 85,
  },
  message: {
    fontSize: 16,
    color: COLORS.lightGrey36,
    textAlign: 'center',
    marginTop: 16,
  },
});

const Empty = ({message = 'No data'}: {message: string}) => {
  return (
    <View style={styled.main}>
      <Image style={styled.image} source={imgEmptySrc} />
      {message && <Text style={styled.message}>{message}</Text>}
    </View>
  );
};

export default memo(Empty);
