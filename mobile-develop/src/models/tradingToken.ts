import {TRADING_CONSTANTS} from '@src/constants/trading';

class TradingToken {
  id?: any;
  name?: any;
  symbol?: any;
  address?: any;
  decimals?: any;
  pDecimals?: any;
  protocol?: any;

  constructor(json: any) {
    if (!json) {
      return {};
    }

    this.id = json.id;
    this.name = json.name;
    this.symbol = json.symbol;
    this.address = json.address;
    this.decimals = json.decimals;
    this.pDecimals = json.pDecimals;
    this.protocol = json.protocol;
  }

  is0x?() {
    return this.protocol === TRADING_CONSTANTS.PROTOCOLS.OX;
  }

  isKyber?() {
    return this.protocol === TRADING_CONSTANTS.PROTOCOLS.KYBER;
  }
}

export default TradingToken;
