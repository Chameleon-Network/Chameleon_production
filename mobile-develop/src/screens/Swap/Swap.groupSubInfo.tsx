import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import { ChevronIcon } from '@components/Icons';
import { useSelector } from 'react-redux';
import History from './Swap.orderHistory';
import Tabs from '@src/components/core/Tabs';
import { ROOT_TAB_SWAP_HISTORY, TAB_SWAP_HISTORY_ID } from '@src/store/pdexV3/swap/constants';
import { getCurrentRouteName } from '@src/services/RouteNameService';
import { useTheme } from 'styled-components/native';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  header: {
    height: 30,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 1,
  }
});

interface GroupSubInfoProps {
  page: number;
  isExpandPage: boolean;
  setShowHistory: (showHistory: boolean) => void;
}

const GroupSubInfo = ({ page, isExpandPage, setShowHistory }: GroupSubInfoProps) => {
  const routeName = getCurrentRouteName();
  const colors = useTheme();
  return (
    <View style={styled.container}>
      <Tabs
        rootTabID={`${ROOT_TAB_SWAP_HISTORY} ${routeName}`}
        rightCustom={(
          <TouchableOpacity
            style={[styled.header, { backgroundColor: colors.btnBG3 }]}
            onPress={() => setShowHistory(!isExpandPage)}
          >
            <ChevronIcon toggle={isExpandPage} />
          </TouchableOpacity>
        )}
      >
        <View
          tabID={`${TAB_SWAP_HISTORY_ID} ${routeName}`}
          label="Swap history"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History page={page} />
        </View>
        {/* Only show Reward history tab when screen is privacy app, not show in Dex
        screen */}
        {/*{routeName !== routeNames.Trade ? (*/}
        {/*  <View*/}
        {/*    tabID={`${TAB_REWARD_HISTORY_ID} ${routeName}`}*/}
        {/*    label="Trading rewards"*/}
        {/*    onChangeTab={() => null}*/}
        {/*    upperCase={false}*/}
        {/*  >*/}
        {/*    <RewardHistory page={page} />*/}
        {/*  </View>*/}
        {/*) : (*/}
        {/*  <View tabID="" label="" onChangeTab={() => null} upperCase={false}>*/}
        {/*    <View />*/}
        {/*  </View>*/}
        {/*)}*/}
        <View tabID="" label="" onChangeTab={() => null} upperCase={false}>
          <View />
        </View>
      </Tabs>
    </View>
  );
};



export default React.memo(GroupSubInfo);
