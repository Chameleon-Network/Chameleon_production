import React from 'react';
import Icons from 'react-native-vector-icons/AntDesign';
import {COLORS} from '@src/styles';
import style from './style';
import {Text, View} from '../core';
import ScrollView from '../core/ScrollView/Component';
import Container from '../core/Container';

const getColor = (type: 'warning' | 'success' | 'info' | 'error') => {
  switch (type) {
    case 'warning':
      return COLORS.orange;
    case 'success':
      return COLORS.green;
    case 'info':
      return COLORS.blue;
    case 'error':
      return COLORS.red;
    default:
      // info as default
      return COLORS.blue;
  }
};

interface SimpleInfoProps {
  type: 'warning' | 'success' | 'info' | 'error';
  text: string;
  subText: string;
  button?: React.ReactNode;
  icon?: React.ReactNode;
}

const SimpleInfo = (props: SimpleInfoProps) => {
  const {
    type,
    text,
    subText,
    button = null,
    icon = (
      <Icons
        name="exclamationcircleo"
        style={style.icon}
        color={getColor(type)}
      />
    ),
  } = props;

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Container style={style.mainContainer}>
        <View style={style.iconContainer}>{icon}</View>
        {text && <Text style={style.text}>{text}</Text>}
        {subText && <Text style={style.subText}>{subText}</Text>}
        {button && <View style={style.buttonContainer}>{button}</View>}
      </Container>
    </ScrollView>
  );
};

export default SimpleInfo;
