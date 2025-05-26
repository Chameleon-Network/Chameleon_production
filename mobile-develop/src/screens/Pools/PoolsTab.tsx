import { View } from '@components/core';
import { BaseTextInputCustom } from '@components/core/BaseTextInput';
import { useNavigation } from '@react-navigation/native';
import BtnCircleBack from '@src/components/Button/BtnCircleBack';
import { Row } from '@src/components/Row';
import { useNavigationParam } from '@src/hooks';
import { navigateToContributePool } from '@src/router/NavigationServices';
import { actionSetContributeID } from '@src/store/pdexV3/liquidity/functions';
import { actionFetchPools } from '@src/store/pdexV3/pools/functions';
import { isFetchingSelector, listPoolsSelector } from '@src/store/pdexV3/pools/selectors';
import { handleFilterPoolByKeySeach } from '@src/store/pdexV3/pools/utils';
import globalStyled from '@src/theme/theme.styled';
import debounce from 'lodash/debounce';
import orderBy from 'lodash/orderBy';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { batch, useDispatch, useSelector } from 'react-redux';
import Pool from './components/Pool';
import { PoolsListHeader } from './Pools.list';
import { COLORS, FONTS } from '@src/styles';


const PoolsList = React.memo(({ onPressPool, pools }: { onPressPool: (poolId: string) => void, pools: any[] }) => {
  const refreshing = useSelector(isFetchingSelector);
  const onRefresh = () => actionFetchPools()
  const data = React.useMemo(() => {
    return orderBy(pools, 'isFollowed', 'desc');
  }, [pools]);
  return (
    <FlatList
      data={data}
      refreshControl={(
        <RefreshControl
          tintColor="white"
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      renderItem={({ item, index }) => (
        <Pool
          poolId={item.poolId}
          onPressPool={() => {
            console.log(item.poolId);
            onPressPool(item.poolId, item);
          }}
          isLast={data && (data.length - 1 === index)}
        />
      )}
      keyExtractor={({ poolId }) => poolId}
      showsVerticalScrollIndicator={false}
    />
  );
});

const PoolsListContainer = (props) => {
  const { onPressPool, listPools, style } = props;
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [pools, setPools] = useState([]);
  const handleGoBack = () => navigation.goBack();
  const _handleGoBack = debounce(handleGoBack, 100);
  const onChange = (text) => {
    setText(text);
    if (!text) {
      return setPools(listPools);
    }
    const tokens = handleFilterPoolByKeySeach({
      data: listPools,
      keySearch: text,
    });
    setPools(tokens);
  };
  useEffect(() => {
    setPools(listPools);
    setText('');
  }, [listPools]);
  return (
    <>
      <Row style={[globalStyled.defaultPaddingHorizontal, { marginBottom: 16 }]} centerVertical>
        <BtnCircleBack onPress={_handleGoBack} />
        <BaseTextInputCustom
          value={text}
          inputProps={{
            onChangeText: onChange,
            placeholder: 'Select pools',
            style: styled.input,
            autoFocus: true,
          }}
        />
      </Row>
      <View style={[styled.container, style]} borderTop>
        <PoolsListHeader />
        <PoolsList onPressPool={onPressPool} pools={pools} />
      </View>
    </>
  );
};

const PoolsTab = () => {
  const onPressPoolParam = useNavigationParam('onPressPool', () => {});
  const dispatch = useDispatch();
  const listPools = (useSelector(listPoolsSelector) || []).filter(({
    token1,
    token2,
  }) => !token1.movedUnifiedToken && !token2.movedUnifiedToken);
  const onPressPool = (poolId) => {
    if (typeof onPressPoolParam === 'function') {
      return onPressPoolParam(poolId);
    }
    batch(() => {
      // dispatch(requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.EARN_NOW)); //TODO
      dispatch(actionSetContributeID({ poolId, nftId: '' }));
      navigateToContributePool();
    });
    // goBack();
  };
  return (
    <PoolsListContainer listPools={listPools} onPressPool={onPressPool} />
  );
};

export default React.memo(PoolsTab);

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: FONTS.SIZE.small,
    color: COLORS.colorGrey3,
    fontFamily: FONTS.NAME.medium,
  },
  input: {
    width: 200,
    height: 40,
  }
});