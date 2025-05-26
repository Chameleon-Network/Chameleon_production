class PolygonToken {
  symbol;
  name;
  address;
  decimals;

  constructor(data: any = {}) {
    this.symbol = data.Symbol;
    this.name = data.Name;
    this.address = data.Address;
    this.decimals = data.Decimals;
  }
}

export default PolygonToken;
