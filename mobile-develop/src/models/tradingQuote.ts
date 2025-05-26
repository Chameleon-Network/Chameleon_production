import {MIN_PERCENT} from '@src/constants/dexV2';
import BigNumber from 'bignumber.js';

class TradingQuote {
  price?: any;
  amount?: any;
  maxPrice?: any;
  minimumAmount?: any;
  expectedRate?: any;
  to?: any;
  data?: any;
  protocol?: any;
  maxAmountOut?: any;

  constructor(json: any) {
    if (!json) {
      return {};
    }

    this.price = json.price;
    this.amount = json.amount;
    this.maxPrice = json.maxPrice;
    this.minimumAmount = json.minimumAmount;
    this.expectedRate = new BigNumber(json.expectedRate).multipliedBy(
      MIN_PERCENT,
    );
    this.to = json.to;
    this.data = json.data;
    this.protocol = json.protocol;
    this.maxAmountOut = json.maxAmountOut;
  }
}

export default TradingQuote;
