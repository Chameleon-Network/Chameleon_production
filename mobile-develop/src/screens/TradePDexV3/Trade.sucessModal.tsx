import ButtonTrade from '@src/components/Button/ButtonTrade';
import {Text} from '@src/components/core';
import {TradeIconSuccess} from '@src/components/Icons';
import {PureModalContent} from '@src/components/Modal/features/PureModal';
import {Row} from '@src/components/Row';
import {navigateToTrade} from '@src/router/NavigationServices';
import {actionToggleModal} from '@src/store/modal/functions';
import {FONTS} from '@src/styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'styled-components/native';

const styled = StyleSheet.create({
  title: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 5,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  desc: {
    ...FONTS.TEXT.incognitoP1,
    textAlign: 'center',
    marginBottom: 16,
  },
  sub: {
    ...FONTS.TEXT.incognitoP1,
    textAlign: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'column',
  },
});

interface TradeSucessModalProps {
  title: string;
  desc: string;
  sub?: string;
  btnTitle?: string;
  handleTradeSucesss?: () => void;
}

const TradeSucessModal = props => {
  const theme = useTheme();
  const {
    title,
    desc,
    sub,
    btnTitle = 'Keep trading',
    handleTradeSucesss,
  } = props;
  const handleKeepTrading = () => {
    actionToggleModal({visible: false, data: null});
    if (typeof handleTradeSucesss === 'function') {
      handleTradeSucesss();
    } else {
      navigateToTrade();
    }
  };
  return (
    <PureModalContent>
      <Row style={styled.row}>
        <TradeIconSuccess />
        <Text style={[styled.title, {color: theme.ctaMain}]}>{title}</Text>
      </Row>
      <Text style={[styled.desc]}>{desc}</Text>
      {sub && <Text style={[styled.sub, {color: theme.subText}]}>{sub}</Text>}
      <ButtonTrade
        btnStyle={{marginTop: 24, marginBottom: 0}}
        title={btnTitle}
        onPress={handleKeepTrading}
      />
    </PureModalContent>
  );
};

export default React.memo(TradeSucessModal);
