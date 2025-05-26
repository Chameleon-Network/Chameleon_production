import React from 'react';
import {Image} from 'react-native';
import {Text} from '../core';
import {FlexView} from '../core/FlexView';
import styles from './styles';

const srcAppMaintain = require('../../assets/images/app-maintain.png');

const AppMaintain = ({message = ''}: {message?: string}) => {
  return (
    <FlexView style={[styles.center, styles.container]}>
      <Image source={srcAppMaintain} style={styles.image} />
      <Text style={styles.title}>Upgrade in progress</Text>
      <Text style={styles.message}>{message}</Text>
    </FlexView>
  );
};

export default AppMaintain;
