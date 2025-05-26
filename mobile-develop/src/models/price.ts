import _ from 'lodash';

class PriceModel {
  pair?: any;
  time?: any;
  value?: any;

  constructor(json: any) {
    if (!json) {
      return {};
    }

    this.pair = json.Pair;
    this.time = json.Timestamp;
    this.value = _.floor(json.Value, 4);
  }
}

export default PriceModel;
