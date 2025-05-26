import React from 'react';
import { StyleSheet } from 'react-native';
import ListToken from './ListToken';
import { FONTS } from '@src/styles';
import { BtnChecked } from '../Button';
import KeyboardAwareScrollView from '../core/KeyboardAwareScrollView';
import { Text } from '../core';

const styled = StyleSheet.create({
  hook: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  hookText: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 5,
    marginLeft: 5,
  },
  paddingTop: {
    paddingTop: 24,
  },
});

const ListAllToken = (props) => {
  const {
    tokensFactories,
    onToggleUnVerifiedTokens,
    toggleUnVerified,
    renderItem,
    styledContainer,
    styledCheckBox,
  } = props;
  return (
    <KeyboardAwareScrollView
      defaultPadding={false}
      contentContainerStyle={[styled.paddingTop, styledContainer]}
    >
      <ListToken {...tokensFactories[0]} renderItem={renderItem} />
      <BtnChecked
        btnStyle={[
          styled.hook,
          tokensFactories[1]?.visible ? null : { marginBottom: 50 },
          styledCheckBox,
        ]}
        onPress={onToggleUnVerifiedTokens}
        checked={toggleUnVerified}
        hook={<Text style={styled.hookText}>Show unverified coins</Text>}
      />
      <ListToken {...tokensFactories[1]} renderItem={renderItem} />
    </KeyboardAwareScrollView>
  );
};

export default React.memo(ListAllToken);
