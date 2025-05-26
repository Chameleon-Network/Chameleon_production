import React, {memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import TabMasterless from './Keychain.tabMasterless';
import TabMasterKey from './Keychain.tabMasterkey';
import RightBtn from './RightBtn';
import BtnInfo from './BtnInfo';
import {
  currentMasterKeySelector,
  masterlessKeyChainSelector,
} from '@src/store/masterKey/selectors';
import Header from '@src/components/Header/Header';

const KeychainScreen = () => {
  const masterKey = useSelector(currentMasterKeySelector);
  const masterlessKey = useSelector(masterlessKeyChainSelector);
  const isMasterless = React.useMemo(
    () => masterKey === masterlessKey,
    [masterKey, masterlessKey],
  );

  const Content = React.useMemo(() => {
    if (isMasterless) return <TabMasterless />;
    return <TabMasterKey />;
  }, [isMasterless]);

  return (
    <View style={{flex: 1}}>
      <Header
        title="Keychain"
        rightHeader={<RightBtn title={masterKey.name} />}
        customHeaderTitle={<BtnInfo />}
      />
      {Content}
    </View>
  );
};

export default memo(KeychainScreen);
