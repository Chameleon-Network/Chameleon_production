import React from 'react';
import {StyleSheet} from 'react-native';
import {PureModalContent} from '@src/components/Modal/features/PureModal';
import {Text} from '@src/components/core';
import {COLORS, FONTS} from '@src/styles';
import ButtonTrade from '@src/components/Button/ButtonTrade';
import {actionToggleModal} from '@src/store/modal/functions';
import {navigateToNFTToken} from '@src/router/NavigationServices';

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

const NFTTokenModal = () => {
  return (
    <PureModalContent>
      <Text style={styled.title}>Mint a ticket to continue.</Text>
      <Text style={styled.desc}>
        {`You don't have any spare tickets to anonymize this transaction. Wait for
        one to free up, or mint another.`}
      </Text>
      <ButtonTrade
        btnStyle={{
          marginTop: 24,
          marginBottom: 0,
          borderRadius: 8,
          backgroundColor: COLORS.black,
        }}
        title="Mint"
        onPress={() => {
          actionToggleModal({visible: false, data: null});
          navigateToNFTToken();
        }}
      />
    </PureModalContent>
  );
};

export default React.memo(NFTTokenModal);
