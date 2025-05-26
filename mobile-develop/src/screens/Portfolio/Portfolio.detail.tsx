import {Text} from '@components/core';
import {BtnPrimary, BtnSecondary} from '@components/core/Button';
import {Row} from '@src/components/Row';
import {MESSAGES} from '@src/constants';
import {
  navigateToContributePool,
  navigateToRemovePool,
} from '@src/router/NavigationServices';
import {useSelector} from '@src/store/getStore';
import {actionToggleModal} from '@src/store/modal/functions';
import {
  actionSetContributeID,
  actionSetRemovePoolToken,
  actionSetRemoveShareID,
} from '@src/store/pdexV3/liquidity/functions';
import {getDataByShareIdSelector} from '@src/store/pdexV3/portforlio/selectors';
import {COLORS, FONTS} from '@src/styles';
import React, {memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {batch} from 'react-redux';
import {useTheme} from 'styled-components/native';
import TwoTokenImage from './Portfolio.image';
import {Hook} from './Portfolio.item';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.medium,
    lineHeight: FONTS.SIZE.medium + 9,
    marginLeft: 6,
  },
  btnText: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
  },
  btnSmall: {
    height: 24,
    width: 75,
    marginLeft: 5,
    borderRadius: 14,
    marginBottom: 0,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warning: {
    color: COLORS.orange,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 9,
    fontFamily: FONTS.NAME.medium,
  },
  leftText: {
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    fontFamily: FONTS.NAME.medium,
  },
  rightText: {
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    fontFamily: FONTS.NAME.medium,
  },
  wrapHook: {
    marginTop: 8,
  },
  errorMessage: {
    color: COLORS.red,
    fontSize: 14,
    marginTop: 15,
  },
});

interface PortfolioModalProps {
  shareId: string;
  onWithdrawFeeLP: (shareId: string) => void;
  showRemove?: boolean;
}
const PortfolioModal = ({
  shareId,
  onWithdrawFeeLP,
  showRemove = true,
}: PortfolioModalProps) => {
  const theme = useTheme();
  const data = useSelector(getDataByShareIdSelector)(shareId);
  const onClose = () => actionToggleModal();
  const onWithdrawPress = () => {
    batch(() => {
      onClose();
      actionSetRemovePoolToken({
        inputToken: token1.tokenId,
        outputToken: token2.tokenId,
      });
      actionSetRemoveShareID(data.shareId);
      navigateToRemovePool();
    });
  };
  const onInvestPress = () => {
    batch(() => {
      onClose();
      actionSetContributeID({
        poolId: data.poolId,
        nftId: data.nftId || '',
      });
      // requestUpdateMetrics(ANALYTICS.ANALYTIC_DATA_TYPE.EARN_NOW);
      navigateToContributePool();
    });
  };
  const onClaimReward = () => {
    onClose();
    setTimeout(() => {
      onWithdrawFeeLP({poolId: data.poolId, shareId});
    }, 500);
  };
  if (!data) return null;
  const {withdrawable, withdrawing, validNFT, disableBtn, share} = data;
  const {hookFactoriesDetail, token1, token2, isEnoughNetworkFeeDefault} =
    data || {};
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Row style={styles.row} centerVertical>
          <Row centerVertical>
            <TwoTokenImage
              iconUrl1={token1.iconUrl}
              iconUrl2={token2.iconUrl}
            />
            <Text style={[styles.title, {marginLeft: 0}]}>
              {`${token1.symbol} / ${token2.symbol}`}
            </Text>
          </Row>
          {showRemove && (
            <BtnPrimary
              title="Remove"
              textStyle={[styles.btnText, {color: theme.background10}]}
              wrapperStyle={[
                styles.btnSmall,
                {backgroundColor: theme.background4},
              ]}
              onPress={onWithdrawPress}
              disabled={disableBtn || !share}
            />
          )}
        </Row>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {hookFactoriesDetail
            .filter(hook => !!hook)
            .map(hook => (
              <Hook
                key={hook?.label}
                {...hook}
                labelStyle={[styles.leftText, {color: theme.text3}]}
                valueTextStyle={[styles.rightText, {color: theme.text1}]}
                style={styles.wrapHook}
              />
            ))}
          {!isEnoughNetworkFeeDefault && (
            <Text style={[styles.errorMessage, {marginLeft: 0}]}>
              {MESSAGES.PRV_NOT_ENOUGHT}
            </Text>
          )}
        </ScrollView>
        {!validNFT && (
          <Text style={styles.warning}>
            You don&apos;t have any spare tickets to make this transaction. Wait
            for one to free up.
          </Text>
        )}
        <Row spaceBetween style={{marginTop: 10}}>
          {!!withdrawable && (
            <BtnSecondary
              title="Withdraw rewards"
              onPress={onClaimReward}
              wrapperStyle={[{flex: 1}, !!share && {marginRight: 8}]}
              textStyle={{color: COLORS.colorBlue}}
              disabled={withdrawing || disableBtn}
            />
          )}
          {!!share && (
            <BtnPrimary
              title="Contribute more"
              onPress={onInvestPress}
              wrapperStyle={{flex: 1}}
              background={COLORS.colorBlue}
              disabled={!validNFT}
            />
          )}
        </Row>
      </View>
    </View>
  );
};

export default memo(PortfolioModal);
