import moment from 'moment';
import _ from 'lodash';
import { BigNumber } from 'bignumber.js';
import { getDecimalSeparator, getGroupSeparator } from '@src/resources/separator';
import { CONSTANT_COMMONS } from '@src/constants';
import { removeTrailingZeroes, toHumanAmount, toNumber } from './common';


export const SHORT_DATE_TIME_FORMAT = 'DD MMM hh:mm A';
export const LONG_DATE_TIME_FORMAT = 'DD MMM YYYY hh:mm A';


const amountCreator = (maxDigits: number) => (
  amount: number,
  decimals: number,
  clipAmount = false,
  decimalDigits = false,
) => {
  try {
    const fmt = {
      decimalSeparator: getDecimalSeparator(),
      groupSeparator: getGroupSeparator(),
      groupSize: 3,
    };

    let _maxDigits: number | undefined = maxDigits;
    let _amount = toHumanAmount(amount, decimals);
    if (clipAmount) {
      let maxDigits = decimals;
      if (_amount > 0 && _amount < 1 && !!decimalDigits) {
        maxDigits = 5;
      }
      if (_amount > 1) {
        maxDigits = 4;
      }
      if (_amount > 1e3) {
        maxDigits = 2;
      }
      if (_amount > 1e5) {
        maxDigits = 0;
      }
      if (decimals) {
        _amount = _.floor(_amount, Math.min(decimals, maxDigits));
      } else {
        _amount = _.floor(_amount, maxDigits);
      }
    }

    if (!Number.isFinite(_amount))
      throw new Error('Can not format invalid amount');

    // if amount is too small, do not round it
    if (_amount > 0 && _amount < 1) {
      _maxDigits = undefined;
    }
    return _amount && _maxDigits
      ? removeTrailingZeroes(
        new BigNumber(_amount).toFormat(
          _maxDigits,
          BigNumber.ROUND_DOWN,
          fmt,
        ),
      )
      : 0;
  } catch {
    return amount;
  }
};

const amountFull = amountCreator;

const amount = amountCreator(CONSTANT_COMMONS.AMOUNT_MAX_FRACTION_DIGITS);

const getDecimalsFromHumanAmount = (humanAmount: number, defaultDecimals: number) => {
  let decimals;
  if (humanAmount > 10) {
    decimals = 2;
  } else if (humanAmount > 1) {
    decimals = 3;
  } else if (humanAmount > 1e-4) {
    decimals = 4;
  } else if (humanAmount > 1e-5) {
    decimals = 5;
  } else {
    decimals = Math.max(defaultDecimals, 6);
  }
  return decimals;
};

const amountVer2 = (amount: number, decimals: number) => {
  try {
    const fmt = {
      decimalSeparator: getDecimalSeparator(),
      groupSeparator: getGroupSeparator(),
      groupSize: 3,
    };
    let _amount = toHumanAmount(amount, decimals);
    if(!decimals) {
      _amount = amount;
    }
    const _decimals = getDecimalsFromHumanAmount(_amount, decimals);
    return _amount
      ? removeTrailingZeroes(
        new BigNumber(_amount).toFormat(_decimals, BigNumber.ROUND_DOWN, fmt),
      )
      : 0;
  } catch (e) {
    return amount;
  }
};

const amountSuffix = (amount: number, decimals: number) => {
  try {
    const fmt = {
      decimalSeparator: getDecimalSeparator(),
      groupSeparator: getGroupSeparator(),
      groupSize: 3,
    };

    let _maxDigits = 2;
    let _amount = toHumanAmount(amount, decimals);
    if (!decimals) {
      _amount = amount;
    }
    let _suffix = '';

    if (!Number.isFinite(_amount))
      throw new Error('Can not format invalid amount');

    if (_amount > 1e3 && _amount < 1e6) {
      _amount = Math.floor(_amount) / 1e3;
      _suffix = 'K';
    }

    if (_amount > 1e6 && _amount < 1e9) {
      _amount = Math.floor(_amount) / 1e6;
      _suffix = 'M';
    }

    if (_amount > 1e9 && _amount < 1e12) {
      _amount = Math.floor(_amount) / 1e9;
      _suffix = 'B';
    }

    // if amount is too small, show 4 digits
    if (_amount > 0 && _amount < 1) {
      _maxDigits = 5;
    }
    return (
      (_amount
        ? removeTrailingZeroes(
          new BigNumber(_amount).toFormat(
            _maxDigits,
            BigNumber.ROUND_DOWN,
            fmt,
          ),
        )
        : 0) + _suffix
    );
  } catch {
    return amount;
  }
};

const formatDateTime = (dateTime: any, formatPattern?: string) =>
  moment(dateTime).format(formatPattern || 'DD MMM hh:mm A');

const toMiliSecond = (second: number) => second * 1000;
//1e9 => 0.000000001
const toFixed = (num: number, decimals = 0) => {
  if (_.isNumber(num) && !_.isNaN(num)) {
    return removeTrailingZeroes(
      num.toFixed(decimals).replace('.', getDecimalSeparator()),
    );
  }

  return number;
};
const formatUnixDateTime = (dateTime: any, formatPattern = 'MMM DD YYYY, HH:mm') =>
  moment.unix(dateTime).format(formatPattern);

const number = (num: number) => {
  const fmt = {
    decimalSeparator: getDecimalSeparator(),
    groupSeparator: getGroupSeparator(),
    groupSize: 3,
  };

  const rs = new BigNumber(num);
  return rs.isFinite() ? rs.toFormat(fmt) : num;
};

const numberWithNoGroupSeparator = (num: number) => {
  const rs = new BigNumber(num);
  return rs.isFinite()
    ? rs.toFormat({
      ...BigNumber.config().FORMAT,
      decimalSeparator: getDecimalSeparator(),
      groupSize: 0,
    })
    : num;
};

const balance = (amount: number, decimals: number, maxDigits: number) => {
  try {
    const fmt = {
      decimalSeparator: getDecimalSeparator(),
      groupSeparator: getGroupSeparator(),
      groupSize: 3,
    };
    const _amount = toHumanAmount(amount, decimals);
    if (!Number.isFinite(_amount))
      throw new Error('Can not format invalid amount');
    return _amount
      ? new BigNumber(_amount).toFormat(maxDigits, BigNumber.ROUND_DOWN, fmt)
      : 0;
  } catch {
    return amount;
  }
};

const formatWithNotation = (number: number, noOfDigits = 2) => {
  const millionNotation = Math.pow(10, 6 + noOfDigits);
  const kiloNotation = Math.pow(10, 3 + noOfDigits);
  const miliNotation = Math.pow(10, -3 + noOfDigits);

  if (number >= millionNotation) {
    return (
      (
        Math.floor(number / Math.pow(10, 6 - noOfDigits)) /
        Math.pow(10, noOfDigits)
      ).toString() + 'M'
    );
  }

  if (number >= kiloNotation) {
    return (
      (
        Math.floor(number / Math.pow(10, 3 - noOfDigits)) /
        Math.pow(10, noOfDigits)
      ).toString() + 'K'
    );
  }

  if (number >= miliNotation) {
    return _.floor(number, noOfDigits);
  }

  return number;
};

const fixedNumber = (number: any, digits = 3) => {
  if (isNaN(number) || isNaN(digits)) return 0;
  return Math.trunc(
    new BigNumber(number)
      .multipliedBy(Math.pow(10, digits))
      .dividedBy(Math.pow(10, digits))
      .toNumber(),
  );
};

const convertDecimalsToPDecimals = ({ number, decimals, pDecimals }: {number: any, decimals: number, pDecimals: number}) => {
  return BigNumber(number)
    .dividedBy(BigNumber(10).pow(decimals))
    .multipliedBy(BigNumber(10).pow(pDecimals))
    .dividedToIntegerBy(1)
    .toNumber();
};

const convertDecimalsHumanAmount = ({ number, decimals, pDecimals }: {number: any, decimals: number, pDecimals: number}) => {
  if (typeof number === 'string') {
    number = toNumber(number, true) || 0;
  }
  const originalAmount =
    convertDecimalsToPDecimals({ number, decimals, pDecimals }) || 0;
  return amount(originalAmount, pDecimals, true);
};

const formatUtil = {
  amount,
  amountFull,
  formatDateTime,
  formatUnixDateTime,
  toMiliSecond,
  toFixed,
  number,
  numberWithNoGroupSeparator,
  amountCreator,
  balance,
  formatWithNotation,
  fixedNumber,
  convertDecimalsToPDecimals,
  convertDecimalsHumanAmount,
  amountSuffix,
  amountVer2,
  getDecimalsFromHumanAmount,
};

export default formatUtil;
