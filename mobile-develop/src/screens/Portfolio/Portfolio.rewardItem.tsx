import {Text} from '@components/core';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import {Row} from '@src/components/Row';
import {actionToggleModal} from '@src/store/modal/functions';
import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {batch} from 'react-redux';
import styled from 'styled-components/native';
import PortfolioModal from './Portfolio.detail';
import TwoTokenImage from './Portfolio.image';
import {portfolioItemStyled as styles} from './Portfolio.styled';

const CustomTouchableOpacity = styled(TouchableOpacity)`
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.border4};
`;

interface RewardItemProps {
  data: any;
  isLast: boolean;
  onWithdrawFeeLP: (params: any) => void;
}

const RewardItem = ({data, isLast, onWithdrawFeeLP}: RewardItemProps) => {
  if (!data) {
    return null;
  }
  const onPress = () => {
    batch(() => {
      actionToggleModal({
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
        data: (
          <ModalBottomSheet
            style={{height: '60%'}}
            customContent={
              <PortfolioModal
                shareId={data.shareId}
                onWithdrawFeeLP={onWithdrawFeeLP}
                showRemove={false}
              />
            }
          />
        ),
      });
    });
  };
  const {token1, token2, rewardUSDSymbolStr} = data || {};

  return (
    <CustomTouchableOpacity
      style={[
        styles.container,
        isLast && {borderBottomWidth: 0, marginBottom: 50},
      ]}
      onPress={onPress}
      key={data.shareId}>
      <Row centerVertical spaceBetween>
        <Row centerVertical>
          <TwoTokenImage iconUrl1={token1.iconUrl} iconUrl2={token2.iconUrl} />
          <Text style={[styles.extraLabel, {marginLeft: 0}]}>
            {`${token1?.symbol} / ${token2?.symbol}`}
          </Text>
        </Row>
        <Text style={[styles.extraLabel]}>{`${rewardUSDSymbolStr}`}</Text>
      </Row>
    </CustomTouchableOpacity>
  );
};

export default memo(RewardItem);
