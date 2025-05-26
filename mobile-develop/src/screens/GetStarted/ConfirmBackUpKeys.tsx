import MainLayout from '@components/MainLayout/index';
import {
  Text,
  View,
} from '@src/components/core';
import RoundCornerButton from '@src/components/core/RoundCornerButton';
import { COLORS, THEME } from '@src/styles';
import React, { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

const checkedIconSrc = require('@src/assets/images/icons/checked-checkbox.png');
const uncheckedIconSrc = require('@src/assets/images/icons/unchecked-checkbox.png');



const ConfirmBackUpKeys = ({ onNext, onBack }) => {
  const [checked, setChecked] = useState(false);

  return (
    <MainLayout header="Confirm" onGoBack={onBack} contentStyle={{flex: 1}}>
      <Text style={styles.title}>Private keys copied to clipboard.</Text>
      <Text style={styles.subContent}>
        Now, record them <Text style={styles.bold}>securely.</Text> Keep them secret – keep them safe!
        {'\n\n'}
        If you lose access to your existing private keys, you lose access to your funds.
      </Text>
      <View style={styles.checkboxWrapper}>
        <CheckBox
          title="I confirm that I have backed up my private keys."
          checked={checked}
          onPress={() => setChecked(!checked)}
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxTitle}
          checkedIcon={<Image source={checkedIconSrc} />}
          uncheckedIcon={<Image source={uncheckedIconSrc} />}
          checkedColor='red'
        />
      </View>
      <RoundCornerButton
        style={styles.button}
        titleStyle={styles.buttonText}
        onPress={onNext}
        disabled={!checked}
        title="Proceed update"
      />
    </MainLayout>
  );
};

export default ConfirmBackUpKeys;

const styles = StyleSheet.create({
  title: {
    ...THEME.text.boldTextStyleSuperMedium,
    fontSize: 20,
  },
  button: {
    marginTop: 50,
    backgroundColor: COLORS.black2,
  },
  buttonText: {
    color: COLORS.white,
  },
  subContent: {
    marginTop: 15,
    ...THEME.text.mediumText,
    lineHeight: 24,
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
    marginTop: 20,
  },
  bold: {
    ...THEME.text.boldTextStyleMedium,
    lineHeight: 24,
  },
});