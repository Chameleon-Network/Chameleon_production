import React from 'react';
import {ChevronIcon} from '../Icons';
import {TouchableOpacity} from '../core';

const BtnRetry = (props: any) => {
  return (
    <TouchableOpacity {...props}>
      <ChevronIcon size={props?.size} toggle={props?.toggle} />
    </TouchableOpacity>
  );
};

export default React.memo(BtnRetry);
