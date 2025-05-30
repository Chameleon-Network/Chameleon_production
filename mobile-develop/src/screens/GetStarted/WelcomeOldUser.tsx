import {
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import RoundCornerButton from '@src/components/core/RoundCornerButton';
import {COLORS, deviceHeight, THEME} from '@src/styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {verticalScale} from 'react-native-size-matters';

const scale = deviceHeight < 550 ? 0.4 : 1;

const styles = StyleSheet.create({
  title: {
    marginTop: verticalScale(120 * scale),
    ...THEME.text.boldTextStyleSuperMedium,
    fontSize: 30,
    textAlign: 'center',
  },
  button: {
    marginTop: verticalScale(40 * scale),
    backgroundColor: COLORS.black2,
  },
  buttonText: {
    color: COLORS.white,
  },
  subContent: {
    marginTop: verticalScale(40 * scale),
    ...THEME.text.regularSizeMediumFontBlack,
    textAlign: 'center',
    lineHeight: 24,
  },
  subButton: {
    marginTop: verticalScale(20 * scale),
    textAlign: 'center',
    ...THEME.text.mediumTextMotto,
  },
});
interface WelcomeOldUserProps {
  onCreate: () => void;
  onImport: () => void;
  onBackUp: () => void;
  isBackUp: boolean;
}
const WelcomeOldUser = ({
  onCreate,
  onImport,
  onBackUp,
  isBackUp,
}: WelcomeOldUserProps) => {
  if (!isBackUp) {
    return (
      <View>
        <Text style={styles.title}>Welcome back.</Text>
        <Text style={styles.subContent}>
          Managing your keychains just got a whole lot more convenient.
          {'\n\n'}
          This is a big update, so please back up your existing private keys
          before continuing. Make doubly sure that you will always be able to
          recover your funds.
        </Text>
        <RoundCornerButton
          style={styles.button}
          titleStyle={styles.buttonText}
          onPress={onBackUp}
          title="Back up now"
        />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Hello again.</Text>
      <Text style={styles.subContent}>
        Things may look a little different since the last time you visited, but
        don’t worry – you&apos;re doing good.
        {'\n\n'}
        When you switch keychains in Assets, you&apos;ll find your existing
        keychains and funds under the heading: Masterless.
        {'\n\n'}
        Ready? Create a master key to continue.
      </Text>
      <RoundCornerButton
        style={styles.button}
        titleStyle={styles.buttonText}
        onPress={onCreate}
        title="Create your master key"
      />
      <TouchableOpacity onPress={onImport}>
        <Text style={styles.subButton}>Restore from phrase</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeOldUser;
