import {Text, View} from '@components/core';
import {BtnPrimary} from '@components/core/Button';
import {navigateToBackupKeys} from '@src/router/NavigationServices';
import {useSelector} from '@src/store/getStore';
import {actionToggleBackupAllKeys} from '@src/store/setting';
import {isToggleBackupAllKeysSelector} from '@src/store/setting/selectors';
import React from 'react';
import Modal from 'react-native-modal';
import {useTheme} from 'styled-components/native';
import styles from './styles';

const AppUpdater = React.memo(() => {
  const isToggleBackupAllKeys = useSelector(isToggleBackupAllKeysSelector);
  const theme = useTheme();
  const handleRemindBackupAllKeys = () => {
    actionToggleBackupAllKeys(false);
    setTimeout(() => {
      navigateToBackupKeys();
    }, 200);
  };

  return (
    <View>
      <Modal
        isVisible={isToggleBackupAllKeys}
        style={styles.dialog}
        onTouchOutside={handleRemindBackupAllKeys}>
        <View style={styles.hook}>
          <Text style={[styles.title, {color: theme.text1}]}>
            Updated new version
          </Text>
          <Text style={[styles.desc, {color: theme.text3}]}>
            {
              'Congratulations, welcome to the latest Incognito app with Privacy version 2.\n Please back up all keychains in a safe place prior to doing any other actions, it will help you recover funds in unexpected circumstances.\n(Note: take your own risk if you ignore it)'
            }
          </Text>
          <BtnPrimary
            title="Go to backup"
            onPress={handleRemindBackupAllKeys}
            wrapperStyle={{marginTop: 30}}
          />
        </View>
      </Modal>
    </View>
  );
});

export default AppUpdater;
