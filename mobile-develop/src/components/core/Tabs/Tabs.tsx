import BtnCircleBack from '@src/components/Button/BtnCircleBack';
import {View} from '@src/components/core';
import {goBack} from '@src/router/NavigationServices';
import {ExHandler} from '@src/services/exception';
import {actionChangeTab} from '@src/store/tabs/functions';
import {activedTabSelector} from '@src/store/tabs/selectors';
import globalStyled from '@src/theme/theme.styled';
import {delay} from '@src/utils';
import debounce from 'lodash/debounce';
import React, {useEffect} from 'react';
import {ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';
import {styled} from './Tabs.styled';
import Tab from './Tabs.tab';
import Tab1 from './Tabs.tab1';

interface ITabsProps {
  styledTabList?: ViewStyle;
  styledTabs?: ViewStyle;
  useTab1?: boolean;
  rightCustom?: React.ReactNode;
  onGoBack?: () => void;
  hideBackButton?: boolean;
  defaultTabHeader?: boolean;
  rootTabID: string;
  defaultTabIndex?: number;
  borderTop?: boolean;
  children: React.ReactNode[];
}
const Tabs = (props: ITabsProps) => {
  const {
    children,
    styledTabList,
    styledTabs,
    useTab1,
    rightCustom,
    onGoBack,
    hideBackButton = true,
    defaultTabHeader,
    rootTabID,
    defaultTabIndex = 0,
    borderTop = true,
  } = props;
  const theme = useTheme();

  const activeTab = useSelector(activedTabSelector)(rootTabID);

  const onClickTabItem = async (tab: string) => {
    try {
      const foundTab = children?.find(chil => chil.props.tabID === tab);
      const {onChangeTab} = foundTab.props || {};
      if (activeTab !== tab) {
        actionChangeTab({
          rootTabID,
          tabID: tab,
        }),
          await delay(0);
        if (typeof onChangeTab === 'function') {
          onChangeTab();
        }
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const renderTabs = () => {
    return children.map(child => {
      const {label, tabID, ...rest} = child?.props;
      if (useTab1) {
        return (
          <Tab1
            activeTab={activeTab}
            key={tabID}
            label={label}
            onClickTab={onClickTabItem}
            tabID={tabID}
            {...rest}
          />
        );
      }
      return (
        <Tab
          activeTab={activeTab}
          key={tabID}
          label={label}
          onClickTab={onClickTabItem}
          tabID={tabID}
          {...rest}
        />
      );
    });
  };

  useEffect(() => {
    try {
      if (children) {
        let {tabID, onChangeTab} = children[defaultTabIndex]?.props;
        if (activeTab) {
          tabID = activeTab;
        }
        actionChangeTab({
          rootTabID,
          tabID,
        });
        if (typeof onChangeTab === 'function') {
          onChangeTab();
        }
      }
    } catch (error) {
      console.log('ERROR HERE', error);
    }
  }, [defaultTabIndex]);

  const handleGoBack = () =>
    typeof onGoBack === 'function' ? onGoBack() : goBack();
  const _handleGoBack = debounce(handleGoBack, 100);

  return (
    <>
      <View
        style={[
          styled.tabs,
          !useTab1 && globalStyled.defaultBorderSection,
          !useTab1 && {backgroundColor: theme.background1},
          defaultTabHeader && styled.defaultTabHeader,
          styledTabs,
        ]}>
        {!hideBackButton && <BtnCircleBack onPress={_handleGoBack} />}
        <View
          style={[
            styled.tabList,
            useTab1 ? styled.tabList1 : styled.tabList,
            styledTabList,
          ]}>
          {renderTabs()}
        </View>
        {rightCustom && rightCustom}
      </View>
      <View borderTop={borderTop} style={styled.tabContent}>
        {children?.map(child => {
          const actived = child?.props?.tabID === activeTab;
          if (!actived) {
            return null;
          }
          return child?.props?.children;
        })}
      </View>
    </>
  );
};

export default React.memo(Tabs);
