import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from '@components/core';
import {navigateToConvertToUnifiedTokenInfo} from '@src/router/NavigationServices';
import BtnQuestionDefault from '@src/components/Button/BtnQuestionDefault';

const srcQuestion = require('../../assets/images/icons/question_gray.png');

const styled = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});

const BtnInfo = () => {
  const handlePress = () => navigateToConvertToUnifiedTokenInfo();
  return (
    <TouchableOpacity style={styled.wrapper} onPress={handlePress}>
      <BtnQuestionDefault icon={srcQuestion} onPress={handlePress} />
    </TouchableOpacity>
  );
};

export default React.memo(BtnInfo);
