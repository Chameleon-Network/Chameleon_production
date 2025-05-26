import React from 'react';
import {TouchableOpacity} from 'react-native';
import {batch} from 'react-redux';
import ModalBottomSheet from '@components/Modal/features/ModalBottomSheet';
import styled from 'styled-components/native';
import {isIOS} from '@utils/platform';
import {portfolioItemStyled as styles} from './Portfolio.styled';
import {useSelector} from '@src/store/getStore';
import {getDataByShareIdSelector} from '@src/store/pdexV3/portforlio/selectors';
import {NormalText} from '@src/components/core/NormalText/NormalText';
import {Row} from '@src/components/Row';
import {actionToggleModal} from '@src/store/modal/functions';
import TwoTokenImage from './Portfolio.image';
import RowSpaceText from '@src/components/core/RowSpaceText';
import PortfolioModal from './Portfolio.detail';

export const Hook = React.memo(
  ({label, value}: {label: string; value: string}) => (
    <RowSpaceText
      label={label}
      value={value}
      style={{marginBottom: isIOS() ? 1 : 7}}
    />
  ),
);

const CustomTouchableOpacity = styled(TouchableOpacity)`
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.border4};
`;

export const Extra = React.memo(({shareId}: {shareId: string}) => {
  const data = useSelector(getDataByShareIdSelector)(shareId);
  const {token1, token2, principalUSD} = data || {};
  return (
    <Row style={[styles.extraContainer]} centerVertical spaceBetween>
      <NormalText
        style={styles.extraLabel}
        text={`${token1?.symbol} / ${token2?.symbol}`}
      />
      <NormalText style={styles.extraLabel} text={`$${principalUSD}`} />
    </Row>
  );
});

interface PortfolioItemProps {
  shareId: string;
  isLast: boolean;
  onWithdrawFeeLP: (shareId: string) => void;
}

const PortfolioItem = ({
  shareId,
  isLast,
  onWithdrawFeeLP,
}: PortfolioItemProps) => {
  const data = useSelector(getDataByShareIdSelector)(shareId);
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
              />
            }
          />
        ),
      });
    });
  };
  const {hookFactories, token1, token2} = data || {};
  return (
    <CustomTouchableOpacity
      style={[
        styles.container,
        isLast && {borderBottomWidth: 0, marginBottom: 50},
      ]}
      onPress={onPress}
      key={shareId}>
      <TwoTokenImage iconUrl1={token1.iconUrl} iconUrl2={token2.iconUrl} />
      <Extra shareId={shareId} />
      {hookFactories.map(hook => (
        <Hook {...hook} key={hook.label} />
      ))}
    </CustomTouchableOpacity>
  );
};

export default React.memo(PortfolioItem);
