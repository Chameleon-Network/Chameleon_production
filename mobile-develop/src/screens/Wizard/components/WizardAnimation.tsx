import {COLORS} from '@src/styles';
import LottieView from 'lottie-react-native';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

export const WizardAnimation = memo(
  ({onAnimationFinish}: {onAnimationFinish: () => void}) => {
    return (
      <View style={styles.container}>
        <LottieView
          autoPlay
          loop={false}
          style={styles.lottie}
          resizeMode="cover"
          onAnimationFinish={onAnimationFinish}
          source={require('../../../assets/lottie/intro.json')}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    width: '100%',
    height: '100%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
  },
});
