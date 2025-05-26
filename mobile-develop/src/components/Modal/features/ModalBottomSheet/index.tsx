import {Text, View} from '@components/core';
import {FONTS} from '@src/styles';
import React, {memo} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, ViewStyle} from 'react-native';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 0,
    height: '75%',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
  },
  safeScreen: {
    flex: 1,
  },
  title: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 10,
    marginBottom: 22,
  },
});

const CustomSafeAreaView = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.background1};
  border-top-left-radius: 24;
  border-top-right-radius: 24;
`;

interface IModalBottomSheetProps {
  title?: string;
  headerView?: React.ReactNode;
  contentView?: React.ReactNode;
  customContent?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}
const ModalBottomSheet = ({
  title,
  headerView,
  contentView,
  customContent,
  style,
}: IModalBottomSheetProps) => {
  return (
    <View
      style={{
        ...styles.container,
        ...style,
      }}>
      <CustomSafeAreaView style={styles.safeScreen}>
        {customContent ? (
          customContent
        ) : (
          <>
            {!!title && <Text style={styles.title}>{title}</Text>}
            {!!headerView && headerView}
            {!!contentView && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {contentView}
              </ScrollView>
            )}
          </>
        )}
      </CustomSafeAreaView>
    </View>
  );
};

export default memo(ModalBottomSheet);
