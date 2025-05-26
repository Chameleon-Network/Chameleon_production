import ButtonTrade from '@src/components/Button/ButtonTrade';
import {PureModalContent} from '@src/components/Modal/features/PureModal';
import {Row} from '@src/components/Row';
import {Text} from '@src/components/core';
import {CONSTANT_CONFIGS} from '@src/constants';
import {navigateToWebview} from '@src/router/NavigationServices';
import {defaultAccountSelector} from '@src/store/account/selectors';
import {useSelector} from '@src/store/getStore';
import {actionToggleModal} from '@src/store/modal/functions';
import {COLORS, FONTS} from '@src/styles';
import React from 'react';
import {Image, StyleSheet} from 'react-native';

const srcFaucetIcon = require('../../../../assets/images/new-icons/faucet_icon.png');

const styled = StyleSheet.create({
  title: {
    fontFamily: FONTS.NAME.bold,
    fontSize: FONTS.SIZE.superMedium,
    lineHeight: FONTS.SIZE.superMedium + 5,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  desc: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.regular,
    lineHeight: FONTS.SIZE.regular + 5,
    color: COLORS.colorGrey3,
    textAlign: 'center',
  },
});

export const useFaucet = () => {
  const account = useSelector(defaultAccountSelector);
  const navigateFaucet = () => {
    navigateToWebview({
      url: `${CONSTANT_CONFIGS.FAUCET_URL}address=${account.paymentAddress}`,
    });
  };
  return [navigateFaucet];
};

const FaucetPRVModal = () => {
  const [navigateFaucet] = useFaucet();
  return (
    <PureModalContent>
      <Row style={{justifyContent: 'center'}}>
        <Image
          source={srcFaucetIcon}
          style={{
            width: 39,
            height: 34.8,
          }}
        />
      </Row>
      <Text style={styled.title}>Faucet PRV</Text>
      <Text style={styled.desc}>
        Incognito collects a small network fee of PRV to pay the miners who help
        power the network.
      </Text>
      <ButtonTrade
        btnStyle={{
          marginTop: 24,
          marginBottom: 0,
          borderRadius: 8,
          backgroundColor: COLORS.black,
        }}
        title="Top up"
        onPress={() => {
          actionToggleModal({
            visible: false,
            data: null,
            shouldCloseModalWhenTapOverlay: true,
          });
          navigateFaucet();
        }}
      />
    </PureModalContent>
  );
};

export default React.memo(FaucetPRVModal);
