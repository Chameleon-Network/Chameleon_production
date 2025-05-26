import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  ArrowCurved,
  ArrowRightGreyIcon,
  IconDownload,
  LockArrowIcon,
  PaperPlusIcon,
  RestoreIcon,
} from '@components/Icons';
import {Text} from '@components/core';
import {itemStyled} from './keychain.styled';
import {Row} from '@src/components/Row';
import {
  currentMasterKeySelector,
  masterlessKeyChainSelector,
} from '@src/store/masterKey/selectors';
import {
  navigateToBackupKeys,
  navigateToCreateAccount,
  navigateToImportAccount,
  navigateToMasterKeyPhrase,
  navigateToStandby,
} from '@src/router/NavigationServices';
import { useTheme } from 'styled-components/native';

const Item = React.memo(({item, isFirst, isLast}) => {
  if (!item) return null;
  const {title, icon: SectionIcon, handlePress} = item;
  const colors = useTheme();
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        itemStyled.wrapSetting,
        isFirst && {paddingTop: 0},
        isLast && {borderBottomWidth: 0},
        {borderBottomColor: colors.border1},
      ]}>
      <Row centerVertical spaceBetween>
        <Row centerVertical>
          <View style={itemStyled.wrapIcon}>
            <SectionIcon />
          </View>
          <Text style={itemStyled.mediumBlack}>{title}</Text>
        </Row>
        <ArrowRightGreyIcon />
      </Row>
    </TouchableOpacity>
  );
});

const KeychainSetting = () => {
  const masterKey = useSelector(currentMasterKeySelector);
  const masterlessKey = useSelector(masterlessKeyChainSelector);
  const isMasterless = React.useMemo(
    () => masterKey === masterlessKey,
    [masterKey, masterlessKey],
  );

  const HookFactories = React.useMemo(() => {
    let _hooks = [];
    if (isMasterless) {
      _hooks.push({
        title: 'Import a keychain',
        desc: 'Using a private key',
        icon: IconDownload,
        handlePress: navigateToImportAccount,
      });
    } else {
      _hooks.push({
        title: 'Create',
        desc: `Create a new keychain in ${masterKey?.name}`,
        icon: PaperPlusIcon,
        handlePress: navigateToCreateAccount,
      });
      _hooks.push({
        title: `Reveal ${masterKey.name} recovery phrase`,
        desc: 'Back up this phrase so that even if you lose your device, you will always have access to your funds',
        icon: LockArrowIcon,
        handlePress: () =>
          navigateToMasterKeyPhrase({
            data: {...masterKey, isBackUp: true},
          }),
      });
      _hooks.push({
        title: 'Import a keychain',
        desc: 'Using a private key',
        icon: IconDownload,
        handlePress: navigateToImportAccount,
      });
    }
    _hooks.push({
      title: 'Back up',
      desc: 'Back up all master keys and masterless private keys',
      icon: ArrowCurved,
      handlePress: navigateToBackupKeys,
    });
    _hooks.push({
      title: 'Restore',
      desc: 'Restore all master keys and masterless private keys',
      icon: RestoreIcon,
      handlePress: navigateToStandby,
    });
    return _hooks;
  }, [masterKey, masterlessKey]);

  const renderItem = (item, index) => (
    <Item
      item={item}
      key={item.title}
      isFirst={index === 0}
      isLast={index === HookFactories.length - 1}
    />
  );

  return <>{HookFactories.map(renderItem)}</>;
};

export default memo(KeychainSetting);
