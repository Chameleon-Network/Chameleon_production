import {RefreshControl, Text, Text3} from '@components/core';
import {EmptyBookIcon} from '@components/Icons';
import {navigateToContributeHistoryDetail} from '@src/router/NavigationServices';
import {COLORS, FONTS} from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import React, {memo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';
import withHistories from './LiquidityHistories.enhance';
import styled from './LiquidityHistories.styled';
import {
  isFetchingContribute,
  mapContributeData,
} from '@src/store/pdexV3/liquidityHistories/selectors';

interface IProps {
  history: any;
  isLast: boolean;
}

const Item = React.memo(({history, isLast}: IProps) => {
  const colors = useTheme;
  const onNextPress = () => navigateToContributeHistoryDetail({history});
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
        <Text style={styled.title}>{`${
          history.poolId ? 'Contribute' : 'Create pool'
        }`}</Text>
      </View>
      <View style={styled.bottomRow}>
        <Text3 style={styled.desc}>{history?.contributeAmountDesc}</Text3>
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

interface IContributeProps {
  onRefresh: () => void;
}

const Contribute = ({onRefresh}: IContributeProps) => {
  const histories = useSelector(mapContributeData);
  const isFetching = useSelector(isFetchingContribute);
  const renderItem = data => (
    <Item history={data.item} isLast={data.index === histories.length - 1} />
  );
  const renderContent = () => {
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
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={<EmptyBookIcon message="Your history is empty" />}
        />
      </View>
    );
  };
  return renderContent();
};

export default withHistories(memo(Contribute));
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
