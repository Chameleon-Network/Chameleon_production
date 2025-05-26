class BEP2Token {
  symbol;
  name;
  originalSymbol;

  constructor(data: any = {}) {
    this.symbol = data.symbol;
    this.name = data.name;
    this.originalSymbol = data.original_symbol;
  }
}

export default BEP2Token;
