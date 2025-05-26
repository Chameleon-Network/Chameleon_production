import {convertUtils} from '@utils/convert';
import format from '@utils/format';
import Fuse from 'fuse.js';
import toLower from 'lodash/toLower';
import { toNumber } from './common';

export const handleFilterTokenByKeySearch = ({tokens, keySearch}: {tokens: any, keySearch?: string}) => {
  let _keySearch = toLower(keySearch?.trim());
  const options = {
    includeScore: false,
    keys: [
      'displayName',
      'name',
      'networkName',
      'symbol',
      'pSymbol',
      'contractId',
      'tokenId',
    ],
  };
  const fuse = new Fuse(tokens, options);
  const result = fuse.search(_keySearch).map(result => result.item);
  return result;
};

export const formatPrice = (price: any, _toNumber = false) => {
  const pDecimals = 9;
  const originalAmount =
    convertUtils.toOriginalAmount(price, pDecimals, true) || 0;
  const result = format.amountVer2(originalAmount, pDecimals);
  return _toNumber ? toNumber(result, true) : Number(result);
};

export const formatAmount = (
  price: any,
  amount: number,
  pDecimals: number,
  togglePDecimals: any,
  decimalDigits: boolean,
  _toNumber = false,
) => {
  // format Amount to origin
  const priceFormat = formatPrice(price, true) || 0;

  // format amount with has decimalDigits
  // const formatAmount = format.amount(amount, pDecimals, true, decimalDigits);
  const _formatAmount = format.amountVer2(amount, pDecimals);

  const totalAmountNumber = toNumber(_formatAmount, true) * priceFormat;

  const amountOriginalFormat =
    convertUtils.toOriginalAmount(totalAmountNumber, togglePDecimals, true) ||
    0;

  const amountBaseToggle = format.amount(
    amountOriginalFormat,
    togglePDecimals,
    true,
    decimalDigits,
  );

  return _toNumber ? toNumber(amountBaseToggle, true) : amountBaseToggle;
};
