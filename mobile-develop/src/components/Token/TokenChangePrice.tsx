import { replace } from "lodash";
import { NormalText } from "../core/NormalText/NormalText";
import { styled } from "./Token.styled";
import formatUtil from "@src/utils/format";

interface IChangePriceProps {
  change: string;
  customStyle: any;
}

export const ChangePrice = (props: IChangePriceProps) => {
  const {change = '0', customStyle = null} = props;
  const isTokenDecrease = change[0] === '-';
  const changeToNumber = Number(replace(change, '-', ''));
  if (changeToNumber === 0) {
    return null;
  }
  return (
    <NormalText
      text={` ${isTokenDecrease ? '-' : '+'}${formatUtil.amountVer2(
        changeToNumber,
        0,
      )}%`}
      style={[
        {
          marginLeft: 5,
        },
        styled.bottomText,
        isTokenDecrease ? styled.redText : styled.greenText,
        customStyle,
      ]}
    />
  );
};