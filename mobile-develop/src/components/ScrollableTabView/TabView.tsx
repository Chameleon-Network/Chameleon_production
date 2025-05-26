import styled from 'styled-components/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar as _ScrollableTabBar,
  DefaultTabBar as _DefaultTabBar,
} from './react-native-scrollable-tab-view';
import {CustomScrollableTabView as _CustomScrollableTabView} from './react-native-scrollable-tab-view/CustomScrollTabBar';
import {COLORS} from '@src/styles';

export const ScrollableTabBar = _ScrollableTabBar;
export const DefaultTabBar = _DefaultTabBar;
export const CustomScrollableTabView = _CustomScrollableTabView;

const SDefaultTabBar = styled(_DefaultTabBar)`
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.gray2};
  height: 44px;
  background-color: ${p => p.theme.background};
`;
const renderTabBar = (props: any) => {
  return <_CustomScrollableTabView {...props} />;
};

const renderDefaultTabBar = () => <SDefaultTabBar tabStyle={styles.tabStyle} />;

const styles = StyleSheet.create({
  tabStyle: {
    paddingBottom: 0,
  },
  tabsContainerStyle: {
    height: 43,
  },
  tabBarTextStyle: {
    fontWeight: '500',
    borderBottomWidth: 0,
    paddingBottom: 4,
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  defaultTabBarTextStyle: {
    fontWeight: '500',
    borderBottomWidth: 0,
    alignItems: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
  },
  tabBarUnderline: {
    height: 3,
    backgroundColor: '#333',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
});

export const STabView = styled(ScrollableTabView).attrs(props => ({
  tabBarTextStyle: styles.tabBarTextStyle,
  tabBarInactiveTextColor: COLORS.gray2,
  tabBarActiveTextColor: COLORS.blue1,
  tabBarUnderlineStyle: {
    height: 3,
    backgroundColor: COLORS.blue1,
  },
  renderTabBar: _p => renderTabBar({...props, ..._p}),
}))``;

export const SDefaultTabView = styled(ScrollableTabView).attrs(props => ({
  tabBarTextStyle: styles.defaultTabBarTextStyle,
  tabBarInactiveTextColor: COLORS.gray2,
  tabBarActiveTextColor: COLORS.blue1,
  tabBarUnderlineStyle: {
    height: 2,
    backgroundColor: COLORS.blue1,
  },
  renderTabBar: renderDefaultTabBar,
}))``;

export const TabViewItem = styled.View<{tabLabel: string}>`
  flex: 1;
`;
