import React from 'react';
import {StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {COLORS, screenWidth} from '@src/styles';
import {View} from '../View';

const CheckSuccess = () => {
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <LottieView
          autoPlay
          source={require('../../../assets/lottie/check.json')}
        />
      </View>
    </View>
  );
};

export default CheckSuccess;

const styles = StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGrey11,
    borderWidth: 0.5,
    borderRadius: screenWidth / 10,
    width: screenWidth / 5,
    height: screenWidth / 5,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
