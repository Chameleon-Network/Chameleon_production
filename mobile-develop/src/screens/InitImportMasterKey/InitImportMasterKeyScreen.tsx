import { Text } from '@components/core/index';
import MainLayout from '@components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import BtnScanQrCode from '@src/components/Button/BtnScanQrCode';
import { useNavigationParams } from '@src/hooks';
import { ROUTE_NAMES } from '@src/router';
import {
  navigateToQRCodeScanner,
  navigateToTutorial,
} from '@src/router/NavigationServices';
import { useSelector } from '@src/store/getStore';
import {
  actionLoadInitial,
  importMasterKey,
  initMasterKey,
} from '@src/store/masterKey/functions';
import { masterKeysSelector } from '@src/store/masterKey/selectors';
import { COLORS, THEME } from '@src/styles';
import globalStyled from '@src/theme/theme.styled';
import { validateMnemonicWithOtherKeys, validateName } from '@src/utils/string';
import _ from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Button from '../InitMasterKey/components/Button';
import Input from '../InitMasterKey/components/Input';

const styles = StyleSheet.create({
  input: {
    marginBottom: 0,
  },
  btn: {
    marginTop: 15,
  },
  error: {
    ...THEME.text.regularTextMotto,
    color: COLORS.orange,
    marginTop: 15,
    fontSize: 14,
  },
});

const InitImportMasterKeyScreen = memo(() => {
  const {redirect, init: isInit} = useNavigationParams<{
    redirect: string;
    init: boolean;
  }>();
  const navigation = useNavigation();
  const masterKeys = useSelector(masterKeysSelector);
  const [name, setName] = useState('');
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState('');
  const [incorrect, setIncorrect] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleNext = async () => {
    try {
      const trimmedPhrase = _.trim(phrase);
      const trimmedName = _.trim(name);

      setImporting(true);
      handleImport(trimmedPhrase, trimmedName, masterKeys);
    } catch (e: any) {
      setError(e?.message || '');
      setImporting(false);
    }
  };

  const handleImport = useCallback(
    _.debounce(async (trimmedPhrase, trimmedName, masterKeys) => {
      try {
        if (!isInit) {
          // TODO: REMOVE THIS WHEN APIs ready
          if (!__DEV__) {
            validateMnemonicWithOtherKeys(trimmedPhrase, masterKeys);
            validateName(trimmedName, masterKeys);
            await importMasterKey({
              name: trimmedName,
              mnemonic: trimmedPhrase,
            });
          }
          navigation.navigate(redirect || ROUTE_NAMES.MasterKeys, {
            refresh: new Date().getTime(),
          });
        } else { 
          // TODO: REMOVE THIS WHEN APIs ready
          if (!__DEV__) {
            await initMasterKey(trimmedName, trimmedPhrase);
            await actionLoadInitial();
          }
          navigateToTutorial();
        }
      } catch (e: any) {
        setError(e?.message || '');
      } finally {
        setImporting(false);
      }
    }, 1000),
    [],
  );

  useEffect(() => {
    setError('');
    setIncorrect(false);
  }, [phrase, name]);

  return (
    <MainLayout
      header="Import master key"
      scrollable
      contentStyle={globalStyled.defaultBorderSection}>
      <Input
        onChangeText={setName}
        label="Master key name"
        placeholder="Master"
        value={name}
      />
      <Input
        onChangeText={setPhrase}
        label="Recovery phrase"
        placeholder="cat dog make ..."
        value={phrase}
        style={styles.input}
        autoCapitalize="none"
        rightComponent={
          <BtnScanQrCode
            style={styles.btn}
            onPress={() => {
              navigateToQRCodeScanner({
                onScanComplete: (data: string) => {
                  if (data) {
                    setPhrase(data);
                  }
                },
              });
            }}
          />
        }
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button
        label={
          incorrect ? 'Incorrect phrase' : importing ? 'Importing...' : 'Import'
        }
        onPress={handleNext}
        disabled={
          !!error ||
          importing ||
          incorrect ||
          _.trim(name || '').length === 0 ||
          _.trim(phrase || '').length === 0
        }
      />
    </MainLayout>
  );
});

export default InitImportMasterKeyScreen;
