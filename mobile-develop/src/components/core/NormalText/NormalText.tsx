import { useSelector } from "@src/store/getStore";
import { prefixCurrency } from "@src/store/shared/selectors";
import { View } from "../View";
import { Text } from "../Text";
import { trim } from "lodash";
import { StyleSheet } from "react-native";
import { FONTS, screenWidth } from "@src/styles";

interface INormalTextProps {
    style: any,
    stylePSymbol?: any,
    containerStyle?: any,
    text: string,
    hasPSymbol?: boolean,
    showBalance?: boolean,
    symbol?: string,
    rightIcon?: any,
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
    numberOfLinesValue?: number,
}

export const NormalText = (props: INormalTextProps) => {
    const prefix = useSelector(prefixCurrency);
    const {
        style,
        stylePSymbol,
        containerStyle,
        text = '',
        hasPSymbol,
        showBalance,
        symbol = '',
        rightIcon,
        ellipsizeMode,
        numberOfLinesValue,
    } = props;
    return (
        <View style={[styled.normalText, containerStyle]}>
            {hasPSymbol && showBalance && (
                <Text style={[styled.pSymbol, stylePSymbol]}>{prefix}</Text>
            )}
            <Text
                numberOfLines={numberOfLinesValue}
                style={[styled.text, style]}
                ellipsizeMode={ellipsizeMode}
            >
                {showBalance ? trim(text) : `••• ${symbol}`}
            </Text>
            {!!rightIcon && rightIcon}
        </View>
    );
};

export const styled = StyleSheet.create({
    text: {
        fontFamily: FONTS.NAME.medium,
        maxWidth: screenWidth / 2 - 50,
        fontSize: FONTS.SIZE.medium,
        lineHeight: FONTS.SIZE.medium + 4,
    },
    pSymbol: {
        fontFamily: FONTS.NAME.specialRegular,
        fontSize: FONTS.SIZE.medium,
        lineHeight: FONTS.SIZE.medium + 4,
    },
    normalText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
