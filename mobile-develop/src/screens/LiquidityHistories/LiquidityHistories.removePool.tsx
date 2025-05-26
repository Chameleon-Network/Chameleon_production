import React, {memo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import styled from './LiquidityHistories.styled';
import {useSelector} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {EmptyBookIcon} from '@components/Icons';
import withHistories from './LiquidityHistories.enhance';
import globalStyled from '@src/theme/theme.styled';
import {useTheme} from 'styled-components/native';
import {COLORS, FONTS} from '@src/styles';
import {navigateToRemoveLPDetail} from '@src/router/NavigationServices';
import {RefreshControl, Text, Text3} from '@src/components/core';
import {
  isFetchingRemoveLP,
  mapRemoveLPData,
} from '@src/store/pdexV3/liquidityHistories/selectors';
import ActivityIndicator from '@src/components/core/ActivityIndicator';

interface IProps {
  history?: any;
  isLast?: boolean;
}

const Item = React.memo(({history, isLast}: IProps) => {
  const colors = useTheme();
  const onNextPress = () => {
    navigateToRemoveLPDetail({history});
  };
  return (
    <TouchableOpacity
      style={[
        styled.wrapperItem,
        isLast && {marginBottom: 20},
        globalStyled.defaultPaddingHorizontal,
        {borderBottomColor: colors.border4},
      ]}
      onPress={onNextPress}>
      <View style={styled.topRow}>
        <Text style={styled.title}>Remove</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text3 style={styled.desc}>{history?.removeLPAmountDesc}</Text3>
        <Text3
          style={[
            styled.status,
            !!history.statusColor && {color: history.statusColor},
          ]}>
          {history?.statusStr}
        </Text3>
      </View>
    </TouchableOpacity>
  );
});

interface IRemoveLPProps {
  onRefresh: () => void;
}

const RemoveLP = ({onRefresh}: IRemoveLPProps) => {
  const isFetching = useSelector(isFetchingRemoveLP);
  const histories = useSelector(mapRemoveLPData);
  const renderItem = data => (
    <Item history={data.item} isLast={data.index === histories.length - 1} />
  );
  const renderContent = () => {
    if (isEmpty(histories) && isFetching)
      return (
        <View style={{marginTop: 25}}>
          <ActivityIndicator />
        </View>
      );
    return (
      <View style={mainStyle.fullFlex}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          data={histories}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={<EmptyBookIcon message="Your history is empty" />}
        />
      </View>
    );
  };
  return renderContent();
};

export default withHistories(memo(RemoveLP));
const mainStyle = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flex: 1,
  },
  fullFlex: {
    flex: 1,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
    height: 50,
    borderRadius: 8,
  },
  scrollView: {
    marginBottom: 70,
  },
  mainInfo: {
    marginVertical: 20,
  },
  bigText: {
    ...FONTS.STYLE.bold,
    color: COLORS.colorTradeBlue,
    fontSize: 35,
    lineHeight: 45,
  },
  error: {
    color: COLORS.red,
    lineHeight: 22,
  },
  extra: {
    marginTop: 25,
  },
  tab1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...globalStyled.defaultPaddingHorizontal,
    paddingBottom: 16,
  },
  styledTabList1: {},
});
