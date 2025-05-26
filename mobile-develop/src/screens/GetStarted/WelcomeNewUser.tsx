import { Text, View } from '@src/components/core';
import RoundCornerButton from '@src/components/core/RoundCornerButton';
import RoundCornerButtonSolid from '@src/components/core/RoundCornerButton/RoundCornerButtonSolid';
import { useDictionary } from '@src/dictionary/hooks';
import { deviceHeight, THEME } from '@src/styles';
import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const scale = deviceHeight < 550 ? 0.4 : 1;

interface WelcomeNewUserProps {
  onCreate: () => void;
  onImport: () => void;
}

const WelcomeNewUser = memo(({ onCreate, onImport }: WelcomeNewUserProps) => {
  const dict = useDictionary();
  return (
    <View borderTop fullFlex style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@src/assets/newImages/Logo.png')} style={styles.image} />
        <Text style={styles.title}>{`${dict.WelcomeTo}\nMastertech Chameleon`}</Text>
        <Text style={styles.subtitle}>{dict.ExperienceFastAndPrivateTradingForYou}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <RoundCornerButtonSolid
          style={styles.button}
          onPress={onImport}
          title={dict.EnterSecretPhrase}
        />
        <RoundCornerButton
          style={styles.button}
          onPress={onCreate}
          title={dict.NewAccount}
        />
      </View>
    </View>
  );
});

export default WelcomeNewUser;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: verticalScale(120 * scale),
  },
  image: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  title: {
    marginTop: verticalScale(20 * scale),
    ...THEME.text.boldTextStyleSuperMedium,
    fontSize: 24,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    marginTop: verticalScale(10 * scale),
    ...THEME.text.mediumTextMotto,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    gap: 10
  },
  button: {
    borderRadius: 99,
  },
});