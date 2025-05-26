import React from 'react';
import {StyleSheet} from 'react-native';
import {THEME} from '@src/styles';
import {navigateToMasterKeys} from '@src/router/NavigationServices';
import RoundCornerButton from '@src/components/core/RoundCornerButton';
import { useTheme } from 'styled-components/native';

const styled = StyleSheet.create({
  btn: {
    width: 100,
    height: 35,
    borderRadius: 25,
  },
  title: {
    ...THEME.text.mediumText,
    fontSize: 15,
  },
});

const RightBtn = ({title}: {title: string}) => {
  const handlePress = React.useCallback(() => {
    navigateToMasterKeys();
  }, []);
  const colors = useTheme();
  return (
    <RoundCornerButton
      style={[styled.btn, {backgroundColor: colors.background11}]}
      title={title}
      titleStyle={styled.title}
      onPress={handlePress}
    />
  );
};

export default React.memo(RightBtn);
