import formatUtil from '@src/utils/format';
import { getOriginalPairRate } from '../utils';
import { toHumanAmount } from '@src/utils/common';

export const mappingOrderBook = (params) => {
  let result = [];
  try {
    const { data = [], token1, token2, isBuy = false, isSell = false } = params;
    result = data.map(
      ({
        token1Amount: token1Value,
        token2Amount: token2Value,
        token1Remain,
      }) => {
        const priceOriginal = getOriginalPairRate({
          token1,
          token2,
          token1Value,
          token2Value,
        });
        const price = toHumanAmount(priceOriginal, token2?.pDecimals);
        const priceStr = formatUtil.amountVer2(priceOriginal, token2?.pDecimals);
        let volumeOriginalAmount = 0,
          volume,
          volumeStr;
        volumeOriginalAmount = token1Remain;
        volume = toHumanAmount(volumeOriginalAmount, token1?.pDecimals);
        volumeStr = formatUtil.amountVer2(volumeOriginalAmount, token1?.pDecimals);
        const res = {
          price,
          priceStr,
          volume,
          volumeStr,
        };
        return res;
      },
    );
  } catch (error) {
    console.log('mappingOrderBook-error', error);
  }
  return result;
};
