import { TouchableOpacity } from '@src/components/core';
import { FONTS } from '@src/styles';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import BtnInfo from '../Button/BtnInfo';
import { NormalText } from '../core/NormalText/NormalText';
import { Row } from '../Row';
import withToken from './Token.enhance';
import { Icon } from './Token.shared';
import { styles } from './TokenFollow';
import { Name } from './TokenName';
import { Symbol } from './TokenSymbol';

const styled = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  row: {
    alignItems: 'center',
  },
  row1: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 2,
  },
  name: {
    ...FONTS.TEXT.incognitoP2,
  },
  symbol: {
    marginTop: 2,
    ...FONTS.TEXT.incognitoH6,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 14,
  },
});

const TokenTrade = (props) => {
  const { style, onPress, network, shortName, tokenId, ...rest } = props;
  const colors = useTheme();
  return (
    <TouchableOpacity
      style={[styled.container, { borderBottomColor: colors.grey8 }]}
      onPress={onPress}
    >
      <Row style={styled.row}>
        <Icon {...rest} style={styled.icon} />
        <Row style={styled.row1}>
          <Row>
            <Symbol
              {...rest}
              styledSymbol={styled.symbol}
              visibleNetworkName={false}
            />
            <BtnInfo
              tokenId={tokenId}
              style={styles.btnInfo}
              version={2}
            />
          </Row>
          <Row>
            <Name
              {...rest}
              name={shortName}
              styledName={[styled.name, { color: colors.subText }]}
              shouldShowInfo={false}
              isVerified={false}
            />
            {!!network && tokenId !== PRVIDSTR && (
              <NormalText
                style={[styles.networkLabel, { backgroundColor: colors.background3, color: colors.grey1 }]}
                text={network}
              />
            )}
          </Row>
        </Row>
      </Row>
    </TouchableOpacity>
  );
};

export default withToken(React.memo(TokenTrade));
