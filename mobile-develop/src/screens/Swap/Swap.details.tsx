import React from 'react';
import { View, StyleSheet } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import { useTabFactories } from './Swap.simpleTab';
import { Hook } from '@src/components/PdexV3/Extra';

const styled = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});

const SwapDetails = () => {
  const { hooksFactories } = useTabFactories();
  return (
    <View style={styled.container}>
      {hooksFactories
        .filter((hook) => !isEmpty(hook))
        .map((hook) => (
          <Hook {...hook} key={hook.label} />
        ))}
    </View>
  );
};


export default React.memo(SwapDetails);
