import React, {memo} from 'react';
import {TABS} from './Keychain.constant';
import Accounts from './Keychain.accounts';
import {styled} from './keychain.styled';
import KeychainSetting from './Keychain.setting';
import {View} from '@src/components/core';
import Tabs from '@src/components/core/Tabs';
import {ScrollViewBorder} from '@src/components/core/ScrollView';

const TabMasterkey = () => {
  return (
    <View
      borderTop
      fullFlex
      style={{overflow: 'visible', paddingHorizontal: 24, paddingTop: 24}}>
      <Tabs rootTabID={TABS.TAB_KEYCHAIN_MASTER_KEY_ID} borderTop={false}>
        <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_LIST_ID} label="Keychains">
          <ScrollViewBorder
            style={styled.wrapper}
            showsVerticalScrollIndicator={false}>
            <Accounts />
          </ScrollViewBorder>
        </View>
        <View tabID={TABS.TAB_KEYCHAIN_MASTER_KEY_SETTING_ID} label="Actions">
          <ScrollViewBorder
            style={styled.wrapper}
            showsVerticalScrollIndicator={false}>
            <KeychainSetting />
          </ScrollViewBorder>
        </View>
      </Tabs>
    </View>
  );
};

export default memo(TabMasterkey);
