import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from '@components/core';
import BtnQuestionDefault from '@src/components/Button/BtnQuestionDefault';
import {navigateToKeysExplained} from '@src/router/NavigationServices';

const srcQuestion = require('../../../assets/images/icons/question_gray.png');

const styled = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});

const BtnInfo = () => {
  return (
    <TouchableOpacity style={styled.wrapper} onPress={navigateToKeysExplained}>
      <BtnQuestionDefault
        icon={srcQuestion}
        onPress={navigateToKeysExplained}
      />
    </TouchableOpacity>
  );
};

BtnInfo.propTypes = {};

export default React.memo(BtnInfo);
