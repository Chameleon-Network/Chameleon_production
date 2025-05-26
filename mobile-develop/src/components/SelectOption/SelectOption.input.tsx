import PropTypes from 'prop-types';
import React from 'react';
import { SelectItem } from './SelectOption.modalSelectItem';

interface SelectItem {
  id: string;
  name: string;
  icon: string;
}

interface SelectOptionInputProps {
  actived: SelectItem;
  options: SelectItem[];
}

const SelectOptionInput = (props: SelectOptionInputProps) => {
  const { options, actived, ...rest } = props;

  return <SelectItem {...actived} itemStyled={{ marginBottom: 0 }} {...rest} />;
};


export default React.memo(SelectOptionInput);
