import { useSelector } from "@src/store/getStore";
import { decimalDigitsSelector } from "@src/store/setting/selectors";
import { formatAmount } from "@src/utils/token";
import { NormalText } from "../core/NormalText/NormalText";
import { styled } from "./Token.styled";
import React from "react";


export const AmountBaseUSDT = React.memo(props => {
  const {
    amount = 0,
    pDecimals = 0,
    priceUsd = 0,
    customPSymbolStyle = null,
    customStyle = null,
    hideBalance = false,
  } = props;
  const decimalDigits = useSelector(decimalDigitsSelector);

  let currentAmount = formatAmount(
    priceUsd,
    amount,
    pDecimals,
    pDecimals,
    decimalDigits,
    false,
  );

  return (
    <NormalText
      hasPSymbol={!hideBalance}
      text={hideBalance ? '•••' : `${currentAmount}`}
      style={[styled.rightText, customStyle]}
      stylePSymbol={[customPSymbolStyle]}
    />
  );
});
