import React from 'react';
import {SectionItem as Section} from '../Section/Section';
import {ClearFillIcon} from '@components/Icons/icon.clear';
import enhance from './RemoveStorage.enhance';

interface RemoveStorageProps {
  onPressRemove: () => void;
}

const RemoveStorage = (props: RemoveStorageProps) => {
  const {onPressRemove} = props;
  return (
    <Section
      data={{
        title: 'Clear history',
        desc: 'Remove locally stored data',
        handlePress: onPressRemove,
        icon: <ClearFillIcon />,
      }}
    />
  );
};

export default enhance(React.memo(RemoveStorage));
