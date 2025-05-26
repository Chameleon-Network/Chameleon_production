import {Text, Text3} from '@components/core';
import {Row} from '@src/components/Row';
import React, {memo} from 'react';
import {ActivityIndicator, View} from 'react-native';
import styled from 'styled-components/native';
import styles from './RowSpaceText.styled';

const RowSpaceText = props => {
  const {
    label,
    value,
    loading,
    style,
    leftStyle,
    rightStyle,
    customLeft,
    customRight,
  } = props;
  return (
    <Row style={[styles.hookContainer, style]}>
      {customLeft ? (
        customLeft
      ) : (
        <Text3 style={[styles.hookLabel, leftStyle]}>{`${label}:`}</Text3>
      )}
      <View style={styles.wrapValue}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : customRight ? (
          customRight
        ) : (
          <CustomText style={[styles.hookValue, rightStyle]} numberOfLines={0}>
            {value}
          </CustomText>
        )}
      </View>
    </Row>
  );
};

const CustomText = styled(Text)`
  color: ${({theme}) => theme.grey2};
`;

export default memo(RowSpaceText);
