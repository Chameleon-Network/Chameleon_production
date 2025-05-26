import BtnCopy from '@src/components/Button/BtnCopy';
import BtnOpenUrl from '@src/components/Button/BtnOpenUrl';
import { Text } from '@src/components/core';
import { Row } from '@src/components/Row';
import ClipboardService from '@src/services/ClipboardService';
import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet } from 'react-native';

export const styled = StyleSheet.create({
  label: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    width: 120,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    minHeight: 24,
  },
  btn: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  value: {
    fontFamily: FONTS.NAME.medium,
    fontSize: FONTS.SIZE.small,
    textAlign: 'left',
    flex: 1,
  },
  rowValue: {
    alignItems: 'flex-start',
    marginLeft: 15,
    flex: 1,
  },
});

export const OrderDetailValue = React.memo(
  ({ copiable, openUrl, handleOpenUrl, value, containerStyle, valueStyle = {}}) => {
    const handleCopy = () => ClipboardService.set(value);
    return (
      <Row style={[styled.rowValue, containerStyle || {}]}>
        <Text style={[styled.value, valueStyle]} ellipsizeMode="middle" numberOfLines={1}>
          {value}
        </Text>
        {copiable && (
          <BtnCopy onPress={handleCopy} containerStyle={styled.btn} />
        )}
        {openUrl && (
          <BtnOpenUrl onPress={handleOpenUrl} containerStyle={[styled.btn, { marginTop: 3 }]} />
        )}
      </Row>
    );
  },
);

const OrderDetail = ({
  label,
  value,
  copiable,
  openUrl,
  handleOpenUrl,
  customValue,
  hookStyled,
  labelStyle,
  valueStyle,
  valueContainerStyle
}) => {
  if (!value || value === 'undefined' || value === 'null') return null;
  return (
    <Row style={{ ...styled.row, ...hookStyled }}>
      <Text
        style={[styled.label, labelStyle || {}]}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {`${label}: `}
      </Text>
      {customValue ? (
        customValue
      ) : (
        <OrderDetailValue
          {...{
            copiable,
            openUrl,
            handleOpenUrl,
            value,
            valueStyle,
            containerStyle: valueContainerStyle || {},
          }}
        />
      )}
    </Row>
  );
};

export default React.memo(OrderDetail);
