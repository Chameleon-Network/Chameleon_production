import {deviceWidth} from '@src/styles';
import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';

const styled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    marginHorizontal: 24,
    borderRadius: 13,
    width: deviceWidth - 50,
    paddingHorizontal: 24,
    paddingVertical: 24,
    position: 'relative',
  },
});

interface IPureModalContentProps {
  children: React.ReactNode;
  styledContainer?: ViewStyle | ViewStyle[];
  styledWrapper?: ViewStyle | ViewStyle[];
}

const PureModalContent = (props: IPureModalContentProps) => {
  const {children, styledContainer, styledWrapper} = props;
  const theme = useTheme();
  return (
    <View style={[styled.container, styledContainer]}>
      <View
        style={[styled.wrapper, {backgroundColor: theme.grey7}, styledWrapper]}>
        {children}
      </View>
    </View>
  );
};

export default React.memo(PureModalContent);
