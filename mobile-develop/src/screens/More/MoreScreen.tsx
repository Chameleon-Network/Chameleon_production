import {
  CommunityIcon,
  ConsolidateIcon,
  ExplorerIcon,
  KeyChainIcon,
  MailIcon,
  MintIcon,
  PowerIcon,
  ProvideIcon,
  ReportIcon,
  UTubeIcon
} from '@components/Icons';
import { CancelOrderIcon } from '@components/Icons/icon.cancelOrder';
import { VectorSettingColor } from '@components/Icons/icon.setting';
import { useNavigation } from '@react-navigation/native';
import Header from '@src/components/Header/Header';
import Modal from '@src/components/Modal';
import { Row } from '@src/components/Row';
import { Text, View5 } from '@src/components/core';
import { ScrollViewBorder } from '@src/components/core/ScrollView';
import { CONSTANT_APP, CONSTANT_CONFIGS } from '@src/constants';
import { ROUTE_NAMES } from '@src/router';
import useFeatureConfig from '@src/shared/hooks/useFeatureConfig';
import { defaultAccountSelector } from '@src/store/account/selectors';
import { useSelector } from '@src/store/getStore';
import { actionConditionConsolidate } from '@src/store/streamline/functions';
import { COLORS, FONTS, screenWidth } from '@src/styles';
import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DEFAULT_PADDING } from '../Wallet/Home/Wallet.styled';

const Categories = [
  {
    data: [
      {
        route: ROUTE_NAMES.PoolV2,
        label: 'Provide',
        icon: ProvideIcon,
        key: CONSTANT_APP.DISABLED.PROVIDE,
      },
      {
        route: ROUTE_NAMES.Node,
        label: 'Power',
        icon: PowerIcon,
        key: CONSTANT_APP.DISABLED.NODE,
      },
      {
        route: ROUTE_NAMES.CreateToken,
        label: 'Mint',
        icon: MintIcon,
        key: CONSTANT_APP.DISABLED.MINT,
      },
      {
        route: ROUTE_NAMES.Community,
        label: ROUTE_NAMES.Community,
        icon: CommunityIcon,
        key: CONSTANT_APP.DISABLED.COMMUNITY,
        params: {
          showHeader: true,
        },
      },
      {
        route: ROUTE_NAMES.Keychain,
        label: ROUTE_NAMES.Keychain,
        icon: KeyChainIcon,
        key: CONSTANT_APP.DISABLED.KEY_CHAIN,
      },
      {
        route: ROUTE_NAMES.Setting,
        label: ROUTE_NAMES.Setting,
        icon: VectorSettingColor,
        key: CONSTANT_APP.DISABLED.SETTING,
        params: {
          showHeader: true,
        },
      },
      {
        route: ROUTE_NAMES.ExportCSV,
        label: 'CSV Export',
        icon: ReportIcon,
        key: CONSTANT_APP.DISABLED.EXPORT_CSV,
        params: {
          showHeader: true,
        },
      },
      {
        route: ROUTE_NAMES.SelectTokenStreamline,
        label: 'Consolidate',
        icon: ConsolidateIcon,
        key: CONSTANT_APP.DISABLED.CONSOLIDATE,
        params: {
          showHeader: true,
        },
      },
      {
        route: ROUTE_NAMES.Tutorial,
        label: 'Tutorial',
        icon: UTubeIcon,
      },
      {
        route: ROUTE_NAMES.pApp,
        label: 'Explorer',
        icon: ExplorerIcon,
        key: CONSTANT_APP.DISABLED.EXPLORER,
        params: {
          url: CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL,
        },
      },
      // {
      //   route: routeNames.WebView,
      //   label: 'Faucet',
      //   icon: FaucetIcon,
      //   key: appConstant.DISABLED.FAUCET,
      // },
      {
        route: ROUTE_NAMES.WebView,
        label: 'Support',
        icon: MailIcon,
        key: CONSTANT_APP.DISABLED.SUPPORT,
      },
      {
        route: ROUTE_NAMES.LegacyPool,
        label: 'Cancel Order',
        icon: CancelOrderIcon,
        key: CONSTANT_APP.DISABLED.LEGACY_POOL,
      },
    ],
  },
];

const CategoryItem = ({ item }: { item: any }) => {
  const account = useSelector(defaultAccountSelector);
  const navigation = useNavigation();

  const onButtonPress = useCallback(() => {
    let params: any;
    switch (item.key) {
      case CONSTANT_APP.DISABLED.FAUCET:
        params = {
          url:
            CONSTANT_CONFIGS.FAUCET_URL + `address=${account.paymentAddress}`,
        };
        break;
      case CONSTANT_APP.DISABLED.CONSOLIDATE:
        actionConditionConsolidate()
        break;
      case CONSTANT_APP.DISABLED.SUPPORT:
        params = {
          url: 'https://we.incognito.org/g/support',
        };
        break;
      default:
        params = item.params;
    }
    return navigation.navigate(item.route, params);
  }, [item]);

  const [onFeaturePress, isDisabled] = useFeatureConfig(
    item.key,
    onButtonPress,
  );
  const Icon = item.icon;
  return (
    <TouchableOpacity
      style={[moreStyled.category, isDisabled && { opacity: 0.7 }]}
      onPress={onFeaturePress}
    >
      <View5 style={moreStyled.wrapIcon}>
        <Icon />
      </View5>
      <Text style={moreStyled.regularBlack}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const TabAssets = memo(() => {
  const renderCategory = (item: any) => (
    <CategoryItem item={item} key={item.label} />
  );
  const renderSections = (item: any) => (
    <View style={moreStyled.wrapCategory} key={item.label}>
      <Row style={{ flexWrap: 'wrap' }}>{item.data.map(renderCategory)}</Row>
    </View>
  );
  return (
    <>
      <Header
        title="Privacy Services"
        hideBackButton
        titleStyled={moreStyled.title}
      />
      <ScrollViewBorder>{Categories.map(renderSections)}</ScrollViewBorder>
      <Modal />
    </>
  );
});

export default TabAssets


const moreStyled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    ...FONTS.TEXT.incognitoH4,
    fontWeight: '600',
  },
  wrapBar: {
    width: screenWidth / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...FONTS.STYLE.normal,
    fontSize: FONTS.SIZE.superSmall,
    lineHeight: FONTS.SIZE.superSmall + 6,
    marginTop: 2,
  },
  category: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (screenWidth - DEFAULT_PADDING * 2) / 4,
    marginBottom: 24,
  },
  regularBlack: {
    ...FONTS.STYLE.medium,
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 7,
    marginTop: 8,
  },
  wrapCategory: {
    marginTop: 10,
  },
  wrapIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black3,
  },
});