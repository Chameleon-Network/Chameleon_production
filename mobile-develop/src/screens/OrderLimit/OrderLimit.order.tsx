import ButtonBasic from '@src/components/Button/ButtonBasic';
import {Text, TouchableOpacity} from '@src/components/core';
import {CancelIcon} from '@src/components/Icons';
import LoadingTx from '@src/components/LoadingTx';
import {Row} from '@src/components/Row';
import {navigateToOrderLimitDetail} from '@src/router/NavigationServices';
import {
  actionFetchedOrderDetail,
  actionWithdrawOrder,
} from '@src/store/pdexV3/oderLimit/functions';
import {FONTS} from '@src/styles';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'styled-components/native';
import RemoveStorageDialog from '../Setting/RemoveStorage/RemoveStorageDialog';

const styled = StyleSheet.create({
  orderWrapper: {
    flex: 1,
    paddingVertical: 24,
  },
  orderValue: {
    fontSize: FONTS.SIZE.small,
    lineHeight: FONTS.SIZE.small + 5,
    fontFamily: FONTS.NAME.medium,
  },
  dividerStyled: {
    marginVertical: 15,
  },
  orderItem: {
    flex: 1,
  },
  btnWithdraw: {
    width: 60,
    height: 18,
  },
  btnTitleWithdraw: {
    fontSize: FONTS.SIZE.small,
    fontFamily: FONTS.NAME.medium,
  },
  subText: {
    fontSize: FONTS.SIZE.small,
    fontFamily: FONTS.NAME.regular,
  },
  mainText: {
    fontSize: FONTS.SIZE.regular,
    fontFamily: FONTS.NAME.medium,
  },
  block1: {
    textAlign: 'left',
    alignItems: 'flex-start',
    flex: 1.5,
  },
  block2: {
    textAlign: 'left',
    alignItems: 'flex-start',
    flex: 1,
  },
  block3: {
    textAlign: 'right',
    alignItems: 'flex-end',
    flex: 1,
  },
  mv8: {
    marginVertical: 8,
  },
});

const OrderValue = React.memo(({style, value}) => {
  return <Text style={style}>{value}</Text>;
});

const Order = React.memo(({data, visibleDivider}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [withdrawData, setWithdrawData] = React.useState({});
  const onPressWithdrawOrder = async data => {
    await setWithdrawData(data);
    await setVisible(true);
  };
  const onWithdrawOrder = async (data?: any) => {
    const isCancelOrder = !isEmpty(withdrawData);
    const payload = await actionWithdrawOrder(data || withdrawData);
    let task = [payload];
    if (isCancelOrder) {
      task.push(setVisible(false));
    }
    await Promise.all(task);
  };

  if (!data) {
    return null;
  }
  const {
    infoStr,
    timeStr,
    mainColor,
    visibleBtnCancel,
    statusStr,
    btnTitleCancel,
    requestTx,
    btnClaim,
    visibleBtnClaim,
    btnTitleClaim,
    btnCancel,
    withdrawing,
    type,
    priceStr,
    amountStr,
    percentStr1,
    visibleBtnAction,
    nftid,
  } = data;
  const renderHook = () => {
    let comp = null;
    if (visibleBtnCancel) {
      comp = (
        <ButtonBasic
          disabled={!visibleBtnAction}
          btnStyle={styled.btnWithdraw}
          title={btnTitleCancel}
          titleStyle={styled.btnTitleWithdraw}
          onPress={() =>
            !!visibleBtnAction &&
            onPressWithdrawOrder({
              ...data,
              txType: ACCOUNT_CONSTANT.TX_TYPE.CANCEL_ORDER_LIMIT,
              subTitle: 'Are you sure you want to cancel\nthis limit order?',
            })
          }
        />
      );
    } else if (visibleBtnClaim) {
      comp = (
        <ButtonBasic
          disabled={!visibleBtnAction}
          btnStyle={styled.btnWithdraw}
          titleStyle={styled.btnTitleWithdraw}
          title={btnTitleClaim}
          onPress={() => {
            !!visibleBtnAction &&
              onWithdrawOrder({
                requestTx,
                txType: ACCOUNT_CONSTANT.TX_TYPE.CLAIM_ORDER_LIMIT,
                nftid,
              });
          }}
        />
      );
    } else if (btnCancel) {
      comp = <OrderValue style={styled.subText} value={btnCancel} />;
    } else if (btnClaim) {
      comp = <OrderValue style={styled.subText} value={btnClaim} />;
    } else {
      comp = <OrderValue style={styled.subText} value={statusStr} />;
    }
    return comp;
  };
  const handleNavOrderDetail = async () => {
    await actionFetchedOrderDetail(data);
    navigateToOrderLimitDetail();
  };
  return (
    <TouchableOpacity onPress={handleNavOrderDetail}>
      <Row style={styled.orderWrapper}>
        <View style={{...styled.orderItem, ...styled.block1}}>
          <Text
            style={{
              textTransform: 'capitalize',
              ...styled.mainText,
              color: mainColor,
            }}>
            {`${type} `}
            <Text
              style={{
                ...styled.mainText,
                textTransform: 'uppercase',
              }}>
              {infoStr}
            </Text>
          </Text>
          <Text
            style={{...styled.subText, color: theme.subText, ...styled.mv8}}>
            Price
          </Text>
          <Text style={{...styled.mainText, color: mainColor}}>{priceStr}</Text>
        </View>
        <View style={{...styled.orderItem, ...styled.block2}}>
          <Text style={{...styled.subText, color: theme.subText}}>
            {timeStr}
          </Text>
          <Text
            style={{...styled.subText, color: theme.subText, ...styled.mv8}}>
            Amount
          </Text>
          <Text style={styled.mainText}>{amountStr}</Text>
        </View>
        <View style={{...styled.orderItem, ...styled.block3}}>
          {renderHook()}
          <Text
            style={{...styled.subText, color: theme.subText, ...styled.mv8}}>
            Fill
          </Text>
          <Text style={styled.mainText}>{percentStr1}</Text>
        </View>
      </Row>
      {withdrawing && <LoadingTx />}
      <RemoveStorageDialog
        visible={visible}
        onPressCancel={() => setVisible(false)}
        onPressAccept={() => onWithdrawOrder()}
        title="Cancel this order"
        subTitle={withdrawData?.subTitle || ''}
        acceptStr="Yes, cancel"
        canStr="Keep it"
        icon={
          <Row center style={{marginBottom: 7}}>
            <CancelIcon />
          </Row>
        }
      />
    </TouchableOpacity>
  );
});

export default Order;
