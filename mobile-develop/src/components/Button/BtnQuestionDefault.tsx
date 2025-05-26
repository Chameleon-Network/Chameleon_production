import React from 'react';
import { TouchableOpacity } from '../core';
import { QuestionIcon } from '../Icons';

const srcQuestionIcon = require('@src/assets/images/icons/question_black.png');

const BtnQuestionDefault = (props) => {
  return (
    <TouchableOpacity {...props}>
      <QuestionIcon
        icon={props?.icon || srcQuestionIcon}
        style={props?.customStyle}
      />
    </TouchableOpacity>
  );
};

export default BtnQuestionDefault;
