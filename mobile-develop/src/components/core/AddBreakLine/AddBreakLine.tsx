import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { CirclePlusIcon } from '@components/Icons';

export const styles = StyleSheet.create({
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  addIcon: {
    position: 'absolute'
  }
});

const Divider = styled.View`
  background-color: ${({ theme }) => theme.border1};
  width: 100%;
  height: 1px;
`;

interface AddBreakLineProps {
  style?: ViewStyle;
  visibleAdd?: boolean;
}

const AddBreakLine = ({ style, visibleAdd }: AddBreakLineProps) => {
  return (
    <View style={[styles.arrowWrapper, style]}>
      <Divider />
      {visibleAdd && (
        <View style={styles.addIcon}>
          <CirclePlusIcon />
        </View>
      )}
    </View>
  );
};

export default memo(AddBreakLine);
