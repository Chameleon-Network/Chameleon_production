import { NormalText } from "../core/NormalText/NormalText";
import { styled } from "./Token.styled";


export const Symbol = props => {
    const {
      symbol = '',
      network = '',
      styledSymbol = null,
      visibleNetworkName = true,
    } = props;
    return (
      <NormalText
        allowFontScaling={false}
        style={[styled.bottomText, styledSymbol]}
        text={`${symbol} ${visibleNetworkName && network ? `(${network})` : ''}`}
      />
    );
  };