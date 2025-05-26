
import { Text, Text3 } from '@src/components/core';
import ActivityIndicator from '@src/components/core/ActivityIndicator';
import { Row } from '@src/components/Row';
import { FONTS } from '@src/styles';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.NAME.regular,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 5,
  },
  desc: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.veryLarge,
    lineHeight: FONTS.SIZE.veryLarge + 10,
  },
  wrapLoading: {
    position: 'relative',
    alignItems: 'flex-start',
    paddingTop: 10,
    height: 44
  }
});

interface TabHeaderProps {
  title: string;
  desc: string;
  loading?: boolean;
  rightIcon?: React.ReactNode;
}

export const HomeTabHeader = memo(({ title, desc, loading = false, rightIcon }: TabHeaderProps) => {
  return (
    <View style={[styled.container]}>
      <Row centerVertical spaceBetween>
        <Text3 style={styled.title}>{title}</Text3>
        {rightIcon}
      </Row>
      {loading ? (
        <View style={styled.wrapLoading}>
          <ActivityIndicator />
        </View>
      ) : (
        <Text style={styled.desc}>{desc}</Text>
      )}
    </View>
  );
});


