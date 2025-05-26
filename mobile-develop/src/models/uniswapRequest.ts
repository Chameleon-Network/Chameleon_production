class UniswapRequest {
  id?: any;
  txId?: any;
  status?: any;

  constructor(json: any) {
    if (!json) {
      return {};
    }

    this.id = json.ID;
    this.status = json.Status;
    this.txId = json.EthereumTx;
  }
}

export default UniswapRequest;
