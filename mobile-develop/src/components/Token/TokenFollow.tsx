import {COLORS, FONTS} from '@src/styles';
import formatUtil from '@src/utils/format';
import {formatPrice} from '@src/utils/token';
import {PRVIDSTR} from 'incognito-chain-web-js/build/wallet';
import replace from 'lodash/replace';
import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import BtnInfo from '../Button/BtnInfo';
import BtnStar from '../Button/BtnStar';
import ImageCached from '../ImageCached';
import {Row} from '../Row';
import {Text, View} from '../core';
import {NormalText} from '../core/NormalText/NormalText';

const srcIncognito = require('../../assets/images/new-icons/incognito.png');

const CustomTouchableOpacity = styled(TouchableOpacity)`
  padding-left: 24px;
  padding-right: 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.border4};
`;

interface ITokenItem {
  iconUrl?: string;
  symbol: string;
  priceUsd: number;
  change?: string;
  tokenId: string;
  isFollowed: boolean;
  shortName: string;
  network?: string;
  hasSameSymbol?: boolean;
  networkName?: string;
}

interface ITokenFollowProps {
  item: ITokenItem;
  hideStar: boolean;
  handleToggleFollowToken: (item: ITokenItem) => Promise<void>;
  onPress: () => void;
  showInfo: boolean;
}

const TokenFollow = ({
  item,
  hideStar,
  handleToggleFollowToken,
  onPress,
  showInfo = true,
}: ITokenFollowProps) => {
  const {symbol, priceUsd, change, tokenId, isFollowed, shortName, network} =
    item;
  const theme = useTheme();
  const balance = React.useMemo(() => {
    const price = priceUsd;
    const isTokenDecrease = change && change[0] === '-';
    const changeToNumber = Number(replace(change, '-', ''));
    const changeStr =
      changeToNumber === 0
        ? '0%'
        : `${isTokenDecrease ? '-' : '+'}${formatUtil.amountVer2(
            changeToNumber,
            0,
          )}%`;
    const changeColor =
      changeToNumber === 0
        ? COLORS.lightGrey34
        : isTokenDecrease
        ? COLORS.red
        : COLORS.green;
    return {
      price: formatPrice(price),
      changeStr,
      changeColor,
    };
  }, [priceUsd]);
  return (
    <CustomTouchableOpacity key={tokenId} onPress={onPress}>
      <Row style={styles.wrapItem}>
        <View centerVertical style={styles.sectionFirst}>
          <Row centerVertical>
            <ImageCached
              uri={item.iconUrl}
              style={styles.icon}
              defaultImage={srcIncognito}
            />
            <View>
              <Row>
                <NormalText style={styles.blackLabel} text={symbol} />
                {showInfo && (
                  <BtnInfo
                    tokenId={tokenId}
                    style={styles.btnInfo}
                    version={2}
                  />
                )}
              </Row>
              <Row>
                <NormalText style={styles.greyText} text={shortName} />
                {!!network && tokenId !== PRVIDSTR && (
                  <NormalText
                    style={[
                      styles.networkLabel,
                      {backgroundColor: theme.background3, color: theme.grey1},
                    ]}
                    text={network}
                  />
                )}
              </Row>
            </View>
          </Row>
        </View>
        <View style={styles.sectionSecond}>
          <NormalText
            text={balance.price}
            containerStyle={styles.containerStyle}
            hasPSymbol
            style={styles.blackLabel}
            stylePSymbol={[
              styles.blackLabel,
              {fontFamily: FONTS.NAME.specialRegular},
            ]}
          />
          <NormalText
            style={[styles.greyText, {color: balance.changeColor}]}
            containerStyle={styles.containerStyle}
            text={balance.changeStr}
          />
        </View>
        {!hideStar && (
          <TouchableOpacity
            style={styles.iconStar}
            onPress={() => handleToggleFollowToken(item)}>
            <BtnStar
              onPress={() => handleToggleFollowToken(item)}
              isBlue={isFollowed}
            />
          </TouchableOpacity>
        )}
      </Row>
    </CustomTouchableOpacity>
  );
};

interface IFollowHeaderProps {
  hideStar: boolean;
}

export const FollowHeader = React.memo(({hideStar}: IFollowHeaderProps) => {
  return (
    <Row style={styles.wrapHeader}>
      <View centerVertical style={styles.sectionFirst}>
        <Text style={styles.headerLabel}>Assets</Text>
      </View>
      <View centerVertical style={styles.sectionSecond}>
        <Text style={styles.headerLabel}>Price</Text>
      </View>
      <View centerVertical style={styles.sectionThird}>
        <Text style={styles.headerLabel}>Change</Text>
      </View>
      {!hideStar && <View style={styles.iconStar} />}
    </Row>
  );
});

export const styles = StyleSheet.create({
  wrapItem: {
    paddingBottom: 16,
    paddingTop: 11,
  },
  blackLabel: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.medium,
    textAlign: 'left',
    lineHeight: FONTS.SIZE.medium + 9,
  },
  icon: {
    marginRight: 12,
    width: 32,
    height: 32,
  },
  sectionFirst: {
    paddingRight: 5,
    height: '100%',
  },
  sectionSecond: {
    flex: 1,
    paddingRight: 5,
    alignItems: 'flex-end',
  },
  sectionThird: {
    width: 90,
    alignItems: 'flex-end',
  },
  greyText: {
    fontFamily: FONTS.NAME.normal,
    fontSize: FONTS.SIZE.small,
    color: COLORS.colorGrey1,
    lineHeight: FONTS.SIZE.small + 7,
  },
  containerStyle: {
    minHeight: 20,
    justifyContent: 'center',
  },
  headerLabel: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.small,
    color: COLORS.colorGrey1,
  },
  wrapHeader: {
    marginTop: 24,
    marginBottom: 5,
  },
  iconStar: {
    width: 24,
    height: FONTS.SIZE.medium + 9,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  networkLabel: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.superSmall,
    textAlign: 'left',
    marginLeft: 6,
    paddingHorizontal: 4,
    borderRadius: 3,
    overflow: 'hidden',
    lineHeight: FONTS.SIZE.superSmall + 4,
  },
  btnInfo: {
    width: 32,
    height: 22,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingLeft: 7,
  },
});

export default memo(TokenFollow);
