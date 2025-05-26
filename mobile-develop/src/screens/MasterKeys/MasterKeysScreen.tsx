import MainLayout from '@components/MainLayout/index';
import { navigateToCreateMasterKey, navigateToImportMasterKey, navigateToKeychain } from '@src/router/NavigationServices';
import { useSelector } from '@src/store/getStore';
import { masterlessKeyChainSelector, noMasterLessSelector } from '@src/store/masterKey/selectors';
import { FONTS } from '@src/styles';
import React, { useCallback } from 'react';
import { StyleSheet, VirtualizedList } from 'react-native';
import MasterKey from '../InitMasterKey/components/MasterKey';
import { removeMasterKey, switchMasterKey } from '@src/store/masterKey/functions';
import { Text, View } from '@src/components/core';
import Action from '../InitMasterKey/components/Action';

const styles = StyleSheet.create({
  padding: {
    marginHorizontal: 25,
    paddingBottom: 5,
  },
  actions: {
    marginTop: 20,
  },
  title: {
    marginBottom: 5,
    ...FONTS.TEXT.label,
  },
});

const MasterKeysScreen = () => {
  const list = useSelector(noMasterLessSelector);
  const masterlessKeyChains = useSelector(masterlessKeyChainSelector);
  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <MasterKey
          number={item.noOfKeychains}
          name={item.name}
          onPress={() => handleSwitch(item.name)}
          onDelete={list.length === 1 ? undefined : handleDelete}
          isActive={item.isActive}
        />
      );
    },
    [list],
  );

  const handleCreate = useCallback(() => {
    navigateToCreateMasterKey()
  }, []);

  const handleImport = useCallback(() => {
    navigateToImportMasterKey()
  }, []);

  const handleSwitch = useCallback(async (name: any) => {
    await switchMasterKey(name)
    navigateToKeychain()
  }, []);

  const handleDelete = useCallback(async (name: any) => {
    await removeMasterKey(name)
  }, []);

  return (
    <MainLayout header="Master keys" scrollable>
      <View>
        <VirtualizedList
          data={list}
          renderItem={renderItem}
          getItem={(data, index) => data[index]}
          getItemCount={(data) => data.length}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {masterlessKeyChains?.noOfKeychains > 0 && (
        <View style={styles.actions}>
          <Text style={[styles.padding, styles.title]}>
            Masterless keychains
          </Text>
          <MasterKey
            name="Tap to manage"
            number={masterlessKeyChains?.noOfKeychains}
            onPress={() => handleSwitch(masterlessKeyChains?.name)}
            isActive={masterlessKeyChains?.isActive}
          />
        </View>
      )}
      <View style={[styles.padding, styles.actions]}>
        <Action
          onPress={handleCreate}
          label="Create"
          desc="Create a new master key"
        />
        <Action
          onPress={handleImport}
          label="Import master key"
          desc="Using a master key phrase"
        />
      </View>
    </MainLayout>
  );
};

export default React.memo(MasterKeysScreen);
