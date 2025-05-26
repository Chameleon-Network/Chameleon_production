import { useSelector } from "@src/store/getStore";
import { decimalDigitsSelector } from "@src/store/setting/selectors";
import { formatAmount } from "@src/utils/token";
import { NormalText } from "../core/NormalText/NormalText";
import { styled } from "./Token.styled";

interface IAmountBasePRVProps {
  amount: number;
  pDecimals: number;
  pricePrv: number;
  customPSymbolStyle: any;
  customStyle: any;
  hideBalance: boolean;
}

export const AmountBasePRV = (props: IAmountBasePRVProps) => {
  const {
    amount = 0,
    pDecimals = 0,
    pricePrv = 0,
    customPSymbolStyle = null,
    customStyle = null,
    hideBalance = false,
  } = props;
  const decimalDigits = useSelector(decimalDigitsSelector);

  let currentAmount = formatAmount(
    pricePrv,
    amount,
    pDecimals,
    pDecimals,
    decimalDigits,
    false,
  );

  return (
    <NormalText
      hasPSymbol={hideBalance ? false : true}
      text={hideBalance ? '•••' : `${currentAmount}`}
      style={[styled.rightText, customStyle]}
      stylePSymbol={[customPSymbolStyle]}
    />
  );
};