import { View } from '@src/components/core';
import Empty from '@src/components/Empty';
import React, { useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import BigList from 'react-native-big-list';

const styles = StyleSheet.create({
  listContentContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

interface IProps {
  tokensFactories: any[];
  renderItem: (item: any) => React.ReactNode;
}

const ListAllToken3 = (props) => {
  const {
    tokensFactories,
    renderItem,
  } = props;

  const memoizedValue = useMemo(() => renderItem, [tokensFactories]);
  const renderKeyExtractor = useCallback(
    (item) => item.tokenId || item.paymentAddress || item.contractId,
    [],
  );

  const renderEmpty = () => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',

        }}
        borderTop
      >
        <Empty />
      </View>
    );
  };

  return (
    <BigList
      keyExtractor={renderKeyExtractor}
      sections={[tokensFactories]}
      renderItem={memoizedValue}
      sectionHeaderHeight={40}
      sectionFooterHeight={40}
      itemHeight={75}
      maxToRenderPerBatch={50}
      initialNumToRender={10}
      windowSize={25}
      renderEmpty={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
    />
  );
};

export default React.memo(ListAllToken3);
