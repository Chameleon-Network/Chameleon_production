import React from 'react';
import { StyleSheet, Image } from 'react-native';

const srcQuestionIcon = require('../../assets/images/icons/question.png');

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const QuestionIcon = props => {
  const { icon = srcQuestionIcon, style = null } = props;
  return <Image source={icon} style={[styled.icon, style]} />;
};

export default QuestionIcon;
