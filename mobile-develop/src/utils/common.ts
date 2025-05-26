import { getDecimalSeparator, getGroupSeparator } from '@src/resources/separator';
import BigNumber from 'bignumber.js';

export const removeTrailingZeroes = (amountString: string) => {
    let formattedString = amountString;
    while (
        formattedString.length > 0 &&
        ((formattedString.includes(getDecimalSeparator()) &&
            formattedString[formattedString.length - 1] === '0') ||
            formattedString[formattedString.length - 1] === getDecimalSeparator())
    ) {
        formattedString = formattedString.slice(0, formattedString.length - 1);
    }

    return formattedString;
};

export const replaceDecimals = (text: string | number, autoCorrect = false) => {
    if (typeof text !== 'string') {
        return text;
    }

    if (
        getDecimalSeparator() === ',' &&
        !text?.includes?.('e+') &&
        !text?.includes?.('e-')
    ) {
        text = text.replace(/\./g, '_');
        text = text.replace(/,/g, '.');
        text = text.replace(/_/g, ',');
    }

    if (autoCorrect) {
        text = text.replace(/,/g, '');
    }

    return text;
};

export const toNumber = (text: string | number, autoCorrect = false) => {
    const number = replaceDecimals(text, autoCorrect);
    return Number(number);
};

export const getFormatSeparators = () => {
    return {
        decimalSeparator: getDecimalSeparator(),
        groupSeparator: getGroupSeparator(),
        groupSize: 3,
    };
};

/**
 *
 * @param {number} originAmount
 * @param {number} decimals
 * Convert original amount (usualy get from backend) to human readable amount or display on frontend
 */
export const toHumanAmount = (originAmount: any, decimals: string | number) => {
    try {
        if (!originAmount) {
            return 0;
        }
        const amount = new BigNumber(originAmount).dividedBy(
            new BigNumber('10').pow(Number(decimals) ? decimals : 0),
        );
        if (amount.isNaN()) {
            return 0;
        }
        return amount.toNumber();
    } catch (error) {
        console.log('CONVERT TO HUMAN AMOUNT ERROR', originAmount, decimals);
        return 0;
    }
}; 