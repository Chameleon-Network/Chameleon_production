import React from "react";

import { useSelector } from "@src/store/getStore";
import { decimalDigitsSelector } from "@src/store/setting/selectors";
import { NormalText } from "../core/NormalText/NormalText";
import { styled } from "./Token.styled";
import ActivityIndicator from "../core/ActivityIndicator";
import { formatAmount } from "@src/utils/token";

export const Amount = props => {
    const {
      amount = 0,
      pDecimals = 0,
      symbol = '',
      customStyle = null,
      showSymbol = true,
      isGettingBalance = false,
      showGettingBalance = false,
      hasPSymbol = false,
      stylePSymbol = null,
      containerStyle = null,
      size = 'small',
      hideBalance = false,
      fromBalance = false,
      ellipsizeMode = 'tail',
    } = props;
    const decimalDigits = useSelector(decimalDigitsSelector);
    console.log('decimalDigits', decimalDigits);
    const shouldShowGettingBalance = isGettingBalance || showGettingBalance;
    if (shouldShowGettingBalance) {
      return <ActivityIndicator size={size} />;
    }
  
    let amountWithDecimalDigits = formatAmount(
      1,
      amount,
      pDecimals,
      pDecimals,
      decimalDigits,
      false,
    );
    const style = hideBalance && fromBalance ? {fontSize: 56} : {};
    const _style = [styled.bottomText, styled.boldText, customStyle, style];
    console.log('amountWithDecimalDigits', hideBalance, fromBalance);
  
    // if (hideBalance) return <Text style={_style}>••••</Text>;
  
    return (
      <NormalText
        // style={_style}
        text={
          hideBalance
            ? fromBalance
              ? '•••••••'
              : `••• ${showSymbol ? symbol : ''}`
            : `${amountWithDecimalDigits} ${showSymbol ? symbol : ''}`
        }
        hasPSymbol={hideBalance ? false : hasPSymbol}
        stylePSymbol={stylePSymbol}
        containerStyle={containerStyle}
        ellipsizeMode={ellipsizeMode}
      />
    );
  };