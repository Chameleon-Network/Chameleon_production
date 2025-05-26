import MainLayout from '@components/MainLayout/index';
import { Text, View } from '@components/core';
import { COLORS, THEME } from '@src/styles';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

import { masterKeysSelector } from '@src/store/masterKey/selectors';
import globalStyled from '@src/theme/theme.styled';
import { useTheme } from 'styled-components/native';
import { validateName } from '@src/utils/string';
import { goBack, navigateToInitMasterKeyPhrase, navigateToMasterKeyPhrase } from '@src/router/NavigationServices';
import Input from './components/Input';
import Button from './components/Button';
import { useSelector } from '@src/store/getStore';

const checkedIconSrc = require('@src/assets/images/icons/checked-checkbox.png');
const uncheckedIconSrc = require('@src/assets/images/icons/unchecked-checkbox.png');

const styles = StyleSheet.create({
  desc: {
    ...THEME.text.mediumText,
  },
  error: {
    ...THEME.text.regularTextMotto,
    color: COLORS.orange,
    marginBottom: 15,
    marginTop: -15,
    fontSize: 14,
  },
  checkboxWrapper: {
    marginTop: 25,
    marginLeft: -10,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginTop: -20,
  },
  checkboxTitle: {
    ...THEME.text.mediumTextMotto,
    fontWeight: '400',
    marginTop: 20,
  },
});

const InitMasterKeyScreen = ({ route }) => {
  const masterKeys = useSelector(masterKeysSelector);
  const theme = useTheme()
  
  const isInit = route.params?.init

  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const handleImport = () => {
    try {
      const data = { name, isInit };
      validateName(name, masterKeys);

      if (isInit) {
        navigateToInitMasterKeyPhrase({data});
      } else {
        navigateToMasterKeyPhrase({data});
      }
    } catch (e: any) {
      setError(e?.message || '');
    }
  };

  const handleBack = () => {
    goBack();
  };

  useEffect(() => {
    setError('');
  }, [name]);

  return (
    <MainLayout
      header="Create master key"
      scrollable
      onGoBack={handleBack}
      contentStyle={globalStyled.defaultBorderSection}
    >
      <Input
        onChangeText={setName}
        label="Master key name"
        placeholder="Master"
        value={name}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.desc}>
        The next screen will contain 12 special words that will allow you to recover your funds.
        {('\n\n')}
        Be prepared to record them in a safe place. If anyone gains access to them, they will gain access to your funds.
      </Text>
      <View style={styles.checkboxWrapper}>
        <CheckBox
          title="I accept that if I lose these words, I will lose access to my funds."
          checked={checked}
          onPress={() => setChecked(!checked)}
          containerStyle={styles.checkbox}
          textStyle={[styles.checkboxTitle, { color: theme.text1 }]}
          checkedIcon={<Image source={checkedIconSrc} />}
          uncheckedIcon={<Image source={uncheckedIconSrc} />}
          checkedColor='red'
        />
      </View>
      <Button
        label="I'm ready"
        onPress={handleImport}
        disabled={!checked}
      />
    </MainLayout>
  );
};

export default InitMasterKeyScreen;
