import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {withTokenVerified} from '@src/components/Token';
import {useNavigationParam} from '@src/hooks';
import Header from '@src/components/Header/Header';
import TokenTrade from '@src/components/Token/TokenTrade';
import ListAllToken from '@src/components/Token/ListAllToken';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const ListAllTokenSelectable = withTokenVerified(props => {
  return <ListAllToken {...props} />;
});

const SelectToken = props => {
  const data = props?.data || useNavigationParam('data') || [];
  const _onSelectToken =
    props?.onSelectToken || useNavigationParam('onSelectToken');
  const onPress = item => {
    if (typeof _onSelectToken === 'function') {
      _onSelectToken(item);
    }
  };
  return (
    <View style={styled.container}>
      <Header canSearch title="Search coins" />
      <ListAllTokenSelectable
        availableTokens={data}
        renderItem={({item}) => (
          <TokenTrade onPress={() => onPress(item)} tokenId={item?.tokenId} />
        )}
      />
    </View>
  );
};

export default SelectToken;
