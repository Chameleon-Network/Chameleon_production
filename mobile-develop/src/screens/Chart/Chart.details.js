import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Hook } from '@screens/PDexV3/features/Extra';
import { detailsSelector } from './Chart.selector';

const styled = StyleSheet.create({
  container: {
    padding: 24,
  },
});

const Details = (props) => {
  const { factories } = useSelector(detailsSelector);
  return (
    <View style={styled.container}>
      {factories.map(({ label, value }) => (
        <Hook key={label} label={label} value={value} />
      ))}
    </View>
  );
};

Details.propTypes = {};

export default React.memo(Details);
