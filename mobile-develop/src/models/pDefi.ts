import { isEmpty } from 'lodash';
import { PRV } from '@src/constants/common';
import { HISTORY_STATUS } from '@src/constants/trading';
import formatUtil from '@src/utils/format';

// const TYPES = ['Incognito', 'Incognito', 'Kyber', '0x', 'Uniswap'];

const TRANSFER_STATUS = {
  PROCESSING: 'processing',
  PENDING: 'pending',
  SUCCESSFUL: 'successful',
  UNSUCCESSFUL: 'unsuccessful',
  INTERRUPTED: 'tap to try again',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PART_REFUNFED: 'part-refunded',
  REJECTED: 'unsuccessful',
  CANCELED: 'canceled',
};

export class RewardModel {
  walletAddress;
  amount1;
  amount2;
  total;
  tokenId1;
  tokenId2;
  pair;
  beaconHeight;
  beaconTime;
  interestRate1;
  interestRate2;

  constructor(data: any = {}) {
    this.walletAddress = data.WalletAddress;
    this.amount1 = data.Amount1;
    this.amount2 = data.Amount2;
    this.total = data.TotalAmount;
    this.tokenId1 = data.Token1ID;
    this.tokenId2 = data.Token2ID;
    this.pair = data.Pair;
    this.beaconHeight = data.BeaconHeight;
    this.beaconTime = data.BeaconTimeStamp;
    this.interestRate1 = data.InterestRate1;
    this.interestRate2 = data.InterestRate2;
  }
}

export class DepositResponse {
  walletAddress;
  depositId;

  constructor(data: any = {}) {
    this.walletAddress = data.WalletAddress;
    this.depositId = data.DepositID;
  }
}

export class PDexTradeHistoryModel {
  id;
  requestTx;
  responseTx;
  buyTokenId;
  buyToken;
  buyAmount;
  buyTokenSymbol;
  sellTokenId;
  sellToken;
  sellAmount;
  sellTokenSymbol;
  networkFee;
  networkFeeTokenSymbol;
  tradingFee;
  tradingFeeTokenSymbol;
  account;
  type;
  exchange;
  description;
  createdAt;
  status;


  constructor({
    history,
  }: { history: any }) {
    if (!history) return;

    this.id = history.requestTx;
    this.requestTx = history.requestTx;
    this.responseTx = history.responseTx;

    this.buyTokenId = history.buyTokenId;
    this.buyToken = history.buyToken;
    this.buyAmount = history.buyAmount;
    if (this.buyToken) {
      this.buyTokenSymbol = this.buyToken?.symbol || '';
      this.buyAmount = formatUtil.amountFull(
        this.buyAmount,
        this.buyToken.pDecimals,
      );
    }

    this.sellTokenId = history.sellTokenId;
    this.sellToken = history.sellToken;
    this.sellAmount = history.sellAmount;
    if (this.sellToken) {
      this.sellTokenSymbol = this.sellToken?.symbol || '';
      this.sellAmount = formatUtil.amountFull(
        this.sellAmount,
        this.sellToken.pDecimals,
      );
    }

    // fee
    this.networkFee = history.networkFee;
    if (this.networkFee) {
      this.networkFee = formatUtil.amountFull(
        this.networkFee,
        PRV.pDecimals,
      );
    }
    this.networkFeeTokenSymbol = PRV.symbol;

    this.tradingFee = history.tradingFee;
    if (this.tradingFee) {
      this.tradingFee = formatUtil.amountFull(
        this.tradingFee,
        PRV.pDecimals,
      );
    }
    this.tradingFeeTokenSymbol = PRV.symbol;

    this.account = history.accountName;
    this.type = 'Trade';
    this.exchange = 'Incognito';
    // this.exchange = TYPES[history.Type] || 'Incognito';
    this.description = `${this.sellAmount} ${this.sellTokenSymbol} to ${this.buyAmount} ${this.buyTokenSymbol}`;
    this.createdAt = formatUtil.formatUnixDateTime(history?.requestTime, LONG_DATE_TIME_FORMAT);

    // status
    const status = history.status;
    if (HISTORY_STATUS.REFUND.includes(status) || HISTORY_STATUS.REJECTED.includes(status) || HISTORY_STATUS.FAIL.includes(status)) {
      this.status = TRANSFER_STATUS.FAILED;
    } else if (HISTORY_STATUS.ACCEPTED.includes(status)) {
      this.status = TRANSFER_STATUS.SUCCESSFUL;
    } else {
      this.status = TRANSFER_STATUS.PENDING;
    }
  }
}
