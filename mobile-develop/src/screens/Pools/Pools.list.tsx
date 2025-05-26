import { useNavigation } from '@react-navigation/native';
import BtnCircleBack from '@src/components/Button/BtnCircleBack';
import { InfoIcon } from '@src/components/Icons';
import { Row } from '@src/components/Row';
import { RefreshControl, Text, TouchableOpacity, View } from '@src/components/core';
import { BaseTextInputCustom } from '@src/components/core/BaseTextInput';
import helperConst from '@src/constants/helper';
import { ROUTE_NAMES } from '@src/router';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { actionFetchPools } from '@src/store/pdexV3/pools/functions';
import { isFetchingSelector } from '@src/store/pdexV3/pools/selectors';
import { handleFilterPoolByKeySeach } from '@src/store/pdexV3/pools/utils';
import { COLORS, FONTS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import debounce from 'lodash/debounce';
import orderBy from 'lodash/orderBy';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Pool from './components/Pool';

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

const HEADER_FACTORIES = [
  {
    text: 'Featured pools',
    style: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    icon: {
      route: ROUTE_NAMES.Helper,
      data: helperConst.HELPER_CONSTANT.LIQUIDITY_APR,
      style: { width: 30, flexDirection: 'row' ,justifyContent: 'center' },
    }
  },
  {
    text: 'APR',
    style: {
      width: 80,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  },
];

export const PoolsListHeader = React.memo(() => {
  const navigation = useNavigation();
  return (
    <Row style={{ marginTop: 32, marginBottom: 8, marginHorizontal: 24 }}>
      {HEADER_FACTORIES.map((item) => (
        <Row centerVertical style={item.style}>
          <Text key={item.text} style={styled.headerText}>
            {item.text}
          </Text>
          {!!item.icon && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(item.icon.route, item.icon.data)
              }
              style={item.icon.style}
            >
              <InfoIcon />
            </TouchableOpacity>
          )}
        </Row>
      ))}
    </Row>
  );
});

interface IPoolsListProps {
  onPressPool: (poolId: string, pool: any) => void;
  pools: any[];
}

export const PoolsList = memo(({ onPressPool, pools }: IPoolsListProps) => {
  const refreshing = useDebounceSelector(isFetchingSelector);
  const onRefresh = () => actionFetchPools()
  const getItemLayout = useCallback((data, index) => (
    { length: 67, offset: 67 * index, index}
  ), []);
  const data = React.useMemo(() => {
    return orderBy(pools, 'isFollowed', 'desc');
  }, [pools]);
  return (
    <FlatList
      data={data}
      refreshControl={(
        <RefreshControl
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
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
});

interface IPoolsListContainerProps {
  onPressPool: (poolId: string, pool: any) => void;
  listPools: any[];
  style?: any;
  canSearch?: boolean;
}

const PoolsListContainer = (props: IPoolsListContainerProps) => {
  const { onPressPool, listPools, style, canSearch = true } = props;
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [pools, setPools] = useState([]);
  const handleGoBack = () => navigation.goBack();
  const _handleGoBack = debounce(handleGoBack, 100);
  const onChange = (text: string) => {
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
      {canSearch && (
        <Row style={[globalStyled.defaultPaddingHorizontal, { marginBottom: 16 }]} centerVertical>
          <BtnCircleBack onPress={_handleGoBack} />
          <BaseTextInputCustom
            value={text}
            inputProps={{
              onChangeText: onChange,
              placeholder: 'Search coins',
              style: styled.input,
              autFocus: true,
            }}
          />
        </Row>
      )}
      <View style={[styled.container, style]} borderTop>
        <PoolsList onPressPool={onPressPool} pools={pools} />
      </View>
    </>
  );
};

export default React.memo(PoolsListContainer);
