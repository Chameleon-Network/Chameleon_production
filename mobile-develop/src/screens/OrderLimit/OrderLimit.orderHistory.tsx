import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {View, RefreshControl} from '@src/components/core';
import {useDispatch} from 'react-redux';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import Order from './OrderLimit.order';
import {Divider} from 'react-native-elements';
import {poolIdSelector} from '@src/store/pdexV3/oderLimit/selectors';
import {actionFetchOrdersHistory} from '@src/store/pdexV3/oderLimit/functions';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
  flatlist: {
    paddingBottom: 24,
  },
});

export const useHistoryOrders = ({field}) => {
  const poolId = useDebounceSelector(poolIdSelector);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actionFetchOrdersHistory(field));
  }, [poolId]);
  return {poolId};
};

interface OrderHistoryProps {
  history?: any[];
  isFetching?: boolean;
  field?: string;
}

const OrderHistory = ({history = [], isFetching, field}: OrderHistoryProps) => {
  useHistoryOrders({field});
  return (
    <View style={styled.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} />}
        data={history}
        keyExtractor={item => item?.requestTx}
        renderItem={({item, index}) => (
          <>
            <Order data={item} visibleDivider={index !== history.length - 1} />
            {index !== history.length - 1 && <Divider />}
          </>
        )}
        contentContainerStyle={styled.flatlist}
      />
    </View>
  );
};

export default React.memo(OrderHistory);
