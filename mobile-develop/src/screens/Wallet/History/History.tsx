import {
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import {View2} from '@src/components/core/View';
import {Dimensions, TextStyle} from 'react-native';

import BtnChevron from '@src/components/Button/BtnChevron';
import BtnCopy from '@src/components/Button/BtnCopy';
import {ScrollViewBorder} from '@src/components/core/ScrollView';
import Header from '@src/components/Header/Header';
import {CopyIcon, OpenUrlIcon} from '@src/components/Icons';
import {QrCodeAddressDefault} from '@src/components/QrCodeAddress';
import {goBack} from '@src/router/NavigationServices';
import ClipboardService from '@src/services/ClipboardService';
import {ExHandler} from '@src/services/exception';
import LinkingService from '@src/services/linking';
import ToastService from '@src/services/ToastService';
import {actionFetchTx} from '@src/store/history/functions';
import {
  historyDetailFactoriesSelector,
  historyDetailSelector,
} from '@src/store/history/selectors';
import {getDefaultAccountWalletSelector} from '@src/store/shared/selectors';
import {COLORS} from '@src/styles';
import React from 'react';
import HTML from 'react-native-render-html';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {styled} from './History.styled';

interface HookProps {
  label?: string;
  value?: string;
  valueTextStyle?: TextStyle;
  handleOpenUrl?: () => void;
  openUrl?: boolean;
  onPressDetail?: () => void;
  showRightIconDetail?: boolean;
  copyable?: boolean;
  disabled?: boolean;
  fullText?: boolean;
  showDetail?: boolean;
  detail?: string;
  canResumeExpiredShield?: boolean;
  canRetryInvalidAmountShield?: boolean;
  isToggleDetail?: boolean;
}

const Hook = React.memo((props: HookProps) => {
  const {
    label,
    value,
    valueTextStyle,
    handleOpenUrl,
    openUrl,
    onPressDetail,
    showRightIconDetail,
    copyable,
    disabled,
    fullText = false,
    showDetail = false,
    detail = '',
    canResumeExpiredShield = false,
    canRetryInvalidAmountShield = false,
    isToggleDetail = false,
  } = props || {};
  const accountWallet = useSelector(getDefaultAccountWalletSelector);
  const {tx} = useSelector(historyDetailSelector);
  const [toggle, setToggle] = React.useState(isToggleDetail || false);
  const [resume, setResume] = React.useState(false);
  const [retry, setRetry] = React.useState(false);
  const handleCopyText = () => {
    ClipboardService.set(value);
    ToastService.show('Copied');
  };
  const handleResumeExpiredShield = async () => {
    try {
      if (resume) {
        return;
      }
      await setResume(true);
      const result = await accountWallet.handleRetryExpiredShield({
        history: tx,
      });
      if (result) {
        ToastService.show(
          'Your request has been sent, we will process it soon. The history status will be updated',
        );
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setResume(false);
      goBack();
    }
  };
  const handleRetryInvalidAmountShield = async () => {
    try {
      if (retry) {
        return;
      }
      await setRetry(true);
      const result = await accountWallet.handleRetryExpiredShield({
        history: tx,
      });
      if (result) {
        ToastService.show(
          'Your request has been sent, we will process it soon. The history status will be updated',
        );
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setRetry(false);
      goBack();
    }
  };
  if (disabled) {
    return null;
  }

  return (
    <>
      <View style={[styled.rowText, fullText && styled.rowFullText]}>
        <Text
          style={[styled.labelText]}
          numberOfLines={1}
          ellipsizeMode="middle">
          {`${label}:`}
        </Text>
        <View style={[styled.extra]}>
          <Text
            style={[styled.valueText, valueTextStyle]}
            numberOfLines={fullText ? 0 : 1}
            ellipsizeMode="middle">
            {value}
          </Text>
          {canResumeExpiredShield && (
            <TouchableOpacity
              style={styled.btnResumeOrRetry}
              onPress={handleResumeExpiredShield}>
              <Text style={styled.textBtnResumeOrRetry}>
                {`Resume${resume ? '...' : ''}`}
              </Text>
            </TouchableOpacity>
          )}
          {canRetryInvalidAmountShield && (
            <TouchableOpacity
              style={styled.btnResumeOrRetry}
              onPress={handleRetryInvalidAmountShield}>
              <Text style={styled.textBtnResumeOrRetry}>
                {`Retry${retry ? '...' : ''}`}
              </Text>
            </TouchableOpacity>
          )}
          {copyable && (
            <TouchableOpacity onPress={handleCopyText}>
              <CopyIcon style={styled.copyIcon} />
            </TouchableOpacity>
          )}
          {openUrl && (
            <TouchableOpacity onPress={handleOpenUrl}>
              <OpenUrlIcon style={styled.linkingIcon} />
            </TouchableOpacity>
          )}
          {showDetail && (
            <BtnChevron
              style={styled.btnChevron}
              size={18}
              toggle={toggle}
              onPress={() => setToggle(!toggle)}
            />
          )}
        </View>
      </View>
      {toggle && (
        <TouchableOpacity
          style={styled.detailContainer}
          activeOpacity={1}
          onPress={() => {
            if (typeof onPressDetail === 'function') {
              onPressDetail();
            }
          }}>
          <HTML
            html={`<p>${detail}</p>`}
            imagesMaxWidth={Dimensions.get('window').width}
            onLinkPress={(e: any, href: string) => {
              LinkingService.openUrl(href);
            }}
            tagsStyles={{
              a: {...styled?.p, ...styled?.a},
              p: {...styled?.p, ...valueTextStyle},
            }}
          />
          {showRightIconDetail && (
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={valueTextStyle?.color || COLORS.lightGrey36}
            />
          )}
        </TouchableOpacity>
      )}
    </>
  );
});

const History = () => {
  const factories = useSelector(historyDetailFactoriesSelector);
  const {tx, fetching} = useSelector(historyDetailSelector);
  if (factories.length === 0) {
    return null;
  }
  console.log('factories::: ', factories);
  const handleRefresh = () => actionFetchTx();
  const onCopyData = () => {
    ClipboardService.set(JSON.stringify(tx));
    ToastService.show('Copied');
  };
  return (
    <View2 style={styled.container}>
      <Header
        title="Transaction detail"
        customHeaderTitle={
          <BtnCopy style={{marginLeft: 10}} isHeader onPress={onCopyData} />
        }
      />
      <ScrollViewBorder
        refreshControl={
          <RefreshControl refreshing={fetching} onRefresh={handleRefresh} />
        }>
        {factories.map((hook, index) => (
          <Hook key={index} {...hook} />
        ))}
        {tx?.shouldRenderQrShieldingAddress && (
          <QrCodeAddressDefault
            label="Shielding address"
            address={tx?.address}
            isPending={tx?.isShielding}
            symbol={tx?.symbol}
            min={tx?.minShield}
          />
        )}
        <View style={{height: 50}} />
      </ScrollViewBorder>
    </View2>
  );
};

export default React.memo(History);
