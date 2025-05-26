import { ArrowDown, EmptyBookIcon } from '@components/Icons';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import { RefreshControl, Text, Text3 } from '@components/core';

import { Row } from '@src/components/Row';
import { navigateToWithdrawFeeLPDetail } from '@src/router/NavigationServices';
import { actionToggleModal } from '@src/store/modal/functions';
import {
  isFetchingWithdrawFeeLP,
  mapWithdrawFeeLPData,
} from '@src/store/pdexV3/liquidityHistories/selectors';
import { COLORS, FONTS } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import React, { memo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';
import withHistories from './LiquidityHistories.enhance';
import styled from './LiquidityHistories.styled';
import { HeaderRow, OneRowCoin } from '../Staking/Staking.item';

const Item = React.memo(({history, isLast}) => {
  const colors = useTheme();
  const onNextPress = () => {
    navigateToWithdrawFeeLPDetail({history});
  };
  const renderModelCell = data => (
    <OneRowCoin token={data.token} valueText={data.amountStr} />
  );

  const onShowReward = () => {
    if (!history.showRewards) return;
    actionToggleModal({
      data: (
        <ModalBottomSheet
          title="Rewards"
          headerView={<HeaderRow array={['Name', 'Amount']} />}
          contentView={
            <View style={{marginTop: 24}}>
              {history.rewards.map(renderModelCell)}
            </View>
          }
        />
      ),
      visible: true,
      shouldCloseModalWhenTapOverlay: true,
    });
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
        <Text style={styled.title}>Withdraw</Text>
      </View>
      <Row spaceBetween centerVertical style={styled.bottomRow}>
        <Text3 style={styled.desc}>{history?.timeStr}</Text3>
        <TouchableOpacity
          style={[styled.bottomRow, {alignItems: 'center'}]}
          onPress={onShowReward}>
          <Text3
            style={[
              styled.status,
              !!history.statusColor && {color: history.statusColor},
            ]}>
            {history?.statusStr}
          </Text3>
          {history.showRewards && (
            <View style={{marginLeft: 10}}>
              <ArrowDown />
            </View>
          )}
        </TouchableOpacity>
      </Row>
    </TouchableOpacity>
  );
});

const RemoveLP = ({onRefresh}) => {
  const isFetching = useSelector(isFetchingWithdrawFeeLP);
  const histories = useSelector(mapWithdrawFeeLPData);
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
