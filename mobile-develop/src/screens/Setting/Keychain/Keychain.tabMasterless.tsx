import React, {memo} from 'react';
import {View} from '@src/components/core';
import {TABS} from './Keychain.constant';
import Accounts from './Keychain.accounts';
import {styled} from './keychain.styled';
import KeychainSetting from './Keychain.setting';
import Tabs from '@src/components/core/Tabs';
import ScrollView from '@src/components/core/ScrollView/Component';

const TabMasterless = () => {
  return (
    <View
      borderTop
      fullFlex
      style={{overflow: 'visible', paddingHorizontal: 24, paddingTop: 24}}>
      <Tabs rootTabID={TABS.TAB_KEYCHAIN_MASTER_LESS_ID} borderTop={false}>
        <View
          tabID={TABS.TAB_KEYCHAIN_MASTER_LESS_LIST_ID}
          label="Masterless keys">
          <ScrollView
            style={styled.wrapper}
            showsVerticalScrollIndicator={false}>
            <Accounts />
          </ScrollView>
        </View>
        <View tabID={TABS.TAB_KEYCHAIN_MASTER_LESS_SETTING_ID} label="Actions">
          <ScrollView
            style={styled.wrapper}
            showsVerticalScrollIndicator={false}>
            <KeychainSetting />
          </ScrollView>
        </View>
      </Tabs>
    </View>
  );
};

export default memo(TabMasterless);
