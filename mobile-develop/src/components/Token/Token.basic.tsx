import React from 'react';
import { View, ViewStyle } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import withToken from './Token.enhance';
import { styled } from './Token.styled';
import { Name } from './TokenName';
import { Amount } from './TokenAmount';
import { Follow } from './ Token.Follow';
import { Symbol } from './TokenSymbol';

interface TokenBasicProps {
  onPress: () => void;
  style: ViewStyle;
  showBalance: boolean;
  shortName: string;
  shouldShowFollowed: boolean;
};

const TokenBasic = (props: TokenBasicProps) => {
  const { onPress, style, showBalance, shortName, shouldShowFollowed } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styled.container, style]}>
        <View style={[styled.extra, styled.extraTop]}>
          <Name {...props} name={shortName} />
          {showBalance && (
            <Amount {...{ ...props, customStyle: styled.boldText }} />
          )}
          {shouldShowFollowed && <Follow {...props} />}
        </View>
        <View style={styled.extra}>
          <Symbol {...props} />
        </View>
      </View>
    </TouchableOpacity>
  );
};


export default withToken(React.memo(TokenBasic));
