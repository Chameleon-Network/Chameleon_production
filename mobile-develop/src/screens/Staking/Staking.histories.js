import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {STAKING_MESSAGES} from '@screens/PDexV3/features/Staking/Staking.constant';
import {Text, TouchableOpacity} from '@components/core';
import styles from '@screens/PoolV2/History/HistoryList/style';
import {historyStyle as historyStyled, itemStyle as itemStyled} from '@screens/PDexV3/features/Staking/Staking.styled';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from 'react-navigation-hooks';
import withHistories from '@screens/PDexV3/features/Staking/Staking.enhanceHistories';
import routeNames from '@routers/routeNames';
import {stakingActions, stakingSelector} from '@screens/PDexV3/features/Staking/index';
import {ArrowDown, EmptyBookIcon} from '@components/Icons';
import {Icon} from '@src/components/Token/Token.shared';
import {HeaderRow, OneRowCoin} from '@screens/PDexV3/features/Staking/Staking.item';
import {actionToggleModal} from '@components/Modal';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';

const HistoryItem = React.memo(({ item, head, onNavigation }) => {
  const dispatch = useDispatch();
  const renderModelCell = (data) => <OneRowCoin token={data.token} valueText={data.amountStr} />;

  const onShowReward = () => {
    if (!item.showRewardList) return;
    dispatch(actionToggleModal({
      data: (
        <ModalBottomSheet
          title='Rewards'
          headerView={<HeaderRow array={['Name', 'Amount']} />}
          contentView={<View style={{ marginTop: 24 }}>{item.rewards.map(renderModelCell)}</View>}
        />
      ),
      visible: true,
      shouldCloseModalWhenTapOverlay: true
    }));
  };

  const renderStatus = () => {
    let COMP = (
      <Row centerVertical style={itemStyled.subRow} spaceBetween>
        <Text style={itemStyled.subTitle}>{item.typeStr}</Text>
        <Text style={[itemStyled.subTitle, { color: item.statusColor }]}>{item.statusStr}</Text>
      </Row>
    );
    if (item.showRewardList) {
      COMP = (
        <Row centerVertical style={itemStyled.subRow} spaceBetween>
          <Text style={itemStyled.subTitle}>{item.typeStr}</Text>
          <TouchableOpacity onPress={onShowReward}>
            <Row centerVertical>
              <Text style={[itemStyled.subTitle, { color: item.statusColor }]}>{item.statusStr}</Text>
              <View style={{ marginLeft: 10 }}>
                <ArrowDown />
              </View>
            </Row>
          </TouchableOpacity>
        </Row>
      );
    }
    return COMP;
  };

  return (
    <TouchableOpacity
      key={item.id}
      style={[styles.historyItem, head && historyStyled.historyTitle]}
      onPress={() => onNavigation(item)}
    >
      <Row spaceBetween centerVertical>
        <Row centerVertical>
          <Icon iconUrl={item.token.iconUrl} style={itemStyled.image} />
          <Text style={[itemStyled.title, { marginLeft: 12 }]}>{item.token.symbol}</Text>
        </Row>
        {!item.showRewardList && <Text style={itemStyled.title}>{item.amountStr}</Text>}
      </Row>
      {renderStatus()}
    </TouchableOpacity>
  );
});

const StakingHistories = ({ onFetchHistories }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const histories = useSelector(stakingSelector.stakingHistoriesMapperSelector);
  const { isFetching } = useSelector(stakingSelector.stakingHistoriesStatus);
  const navigateHistoryDetail = (data) => navigation.navigate(routeNames.StakingHistoryDetail, { data });
  const renderHistoryItem = (data) => <HistoryItem item={data.item} head={data.index === 0} onNavigation={navigateHistoryDetail} />;
  const renderContent = () => {
    return (
      <FlatList
        data={histories}
        refreshing={isFetching}
        onRefresh={() => {
          if (typeof onFetchHistories === 'function') {
            onFetchHistories();
          }
        }}
        renderItem={renderHistoryItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={(
          <EmptyBookIcon message="There have no staking histories" />
        )}
      />
    );
  };
  React.useEffect(() => {
    dispatch(stakingActions.actionFetchHistories());
  }, []);
  return (
    <View style={mainStyle.container}>
      <Header title={STAKING_MESSAGES.histories} />
      <View style={historyStyled.wrapper}>
        {renderContent()}
      </View>
    </View>
  );
};

HistoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  head: PropTypes.bool.isRequired,
  onNavigation: PropTypes.func.isRequired,
};

StakingHistories.propTypes = {
  onFetchHistories: PropTypes.func.isRequired,
};

export default withHistories(memo(StakingHistories));
