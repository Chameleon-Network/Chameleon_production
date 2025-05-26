import { useSelector } from "@src/store/getStore";
import { NormalText } from "../core/NormalText/NormalText";
import { styled } from "./Token.styled";
import { pTokenSelector } from "@src/store/shared/selectors";
import { View } from "../core";
import { formatPrice } from "@src/utils/token";

export const Price = props => {
    const {priceUsd, pricePrv, textStyle} = props;
    const {isToggleUSD} = useSelector(pTokenSelector);
    return (
      <View style={styled.priceContainer}>
        <NormalText
          text={formatPrice(isToggleUSD ? priceUsd : pricePrv)}
          hasPSymbol
          stylePSymbol={textStyle}
          style={[styled.bottomText, textStyle]}
        />
      </View>
    );
  };
  