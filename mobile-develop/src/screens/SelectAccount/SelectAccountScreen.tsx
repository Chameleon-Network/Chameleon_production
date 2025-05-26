import React, {memo} from 'react';
import {TABS} from './SelectAccount.constant';
import {View, View2} from '@src/components/core';
import SelectAccountMasterKeys from './SelectAccountMasterkeys';
import Header from '@src/components/Header/Header';
import BtnInfo from '@src/components/Button/BtnInfo';
import Tabs from '@src/components/core/Tabs';
import globalStyled from '@src/theme/theme.styled';
import withLazy from '@src/components/LazyHoc/withLazy';
import SelectAccountMasterless from './SelectAccountMasterless';

const SelectAccountScreen = () => {
  return (
    <View2 fullFlex>
      <Header title="Keychain" customHeaderTitle={<BtnInfo />} />
      <Tabs
        rootTabID={TABS.TAB_SELECT_ACCOUNT_ID}
        borderTop={false}
        styledTabs={globalStyled.defaultPadding4}>
        <View tabID={TABS.TAB_SELECT_ACCOUNT_MASTER_KEY_ID} label="Master keys">
          <SelectAccountMasterKeys />
        </View>
        <View tabID={TABS.TAB_SELECT_ACCOUNT_MASTER_LESS_ID} label="Masterless">
          <SelectAccountMasterless />
        </View>
      </Tabs>
    </View2>
  );
};

export default withLazy(memo(SelectAccountScreen));
