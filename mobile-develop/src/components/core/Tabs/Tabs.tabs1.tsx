import {View} from '@src/components/core';
import {ExHandler} from '@src/services/exception';
import {useSelector} from '@src/store/getStore';
import {actionChangeTab} from '@src/store/tabs/functions';
import {activedTabSelector} from '@src/store/tabs/selectors';
import {delay} from '@src/utils';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {styled, styled as tabsStyled} from './Tabs.styled';
import Tab from './Tabs.tab';
import Tab1 from './Tabs.tab1';
import {Row} from '@src/components/Row';

const styledTabs = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

interface ITabs1Props {
  rootTabID: string;
  styledTabList: any;
  onClickTabItem: (tabID: string) => void;
  renderTabs: () => React.ReactNode;
  rightCustom: React.ReactNode;
  containerStyled: any;
  children: React.ReactNode[];
  useTab1: boolean;
  defaultTabIndex: number;
  borderTop: boolean;
}

const Tabs1 = (props: ITabs1Props) => {
  const {} = props;

  const {
    children,
    rootTabID,
    useTab1 = false,
    defaultTabIndex = 0,
    borderTop = true,
    styledTabList,
    rightCustom,
    containerStyled,
  } = props;

  const activeTab = useSelector(activedTabSelector)(rootTabID);
  const onClickTabItem = async tab => {
    try {
      const foundTab = children.find(chil => chil.props.tabID === tab);
      const {onChangeTab} = foundTab?.props || {};
      if (activeTab !== tab) {
        actionChangeTab({
          rootTabID,
          tabID: tab,
        });
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
      const {label, tabID, ...rest} = child.props;
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

  return (
    <>
      <Row style={{...styledTabs.container, ...containerStyled}}>
        <View style={[tabsStyled.tabList, styledTabList]}>{renderTabs()}</View>
        {rightCustom}
      </Row>
      <View borderTop={borderTop} style={styled.tabContent}>
        {children?.map(child => {
          const actived = child.props.tabID === activeTab;
          if (!actived) {
            return null;
          }
          return child.props.children;
        })}
      </View>
    </>
  );
};

export default React.memo(Tabs1);
