export interface AccountData {
  AccountName?: string;
  name?: string;
  value?: number | string;
  PaymentAddress?: string;
  ReadonlyKey?: string;
  PrivateKey?: string;
  PublicKey?: string;
  PublicKeyCheckEncode?: string;
  PublicKeyBytes?: string;
  BLSPublicKey?: string;
  ValidatorKey?: string;
  OTAKey?: string;
  PaymentAddressV1?: string;
  ID?: string | number;
}

class Account {
  name?: string;
  value?: any;
  PaymentAddress?: string;
  ReadonlyKey?: string;
  PrivateKey?: string;
  PublicKey?: string;
  PublicKeyCheckEncode?: string;
  PublicKeyBytes?: string;
  BLSPublicKey?: string;
  ValidatorKey?: string;
  OTAKey?: string;
  PaymentAddressV1?: string;
  ID?: string| number;
  accountName?: string;

  constructor(data: AccountData = {}) {
    this.name = data?.AccountName;
    this.value = data?.value;
    this.PaymentAddress = data?.PaymentAddress;
    this.ReadonlyKey = data?.ReadonlyKey;
    this.PrivateKey = data?.PrivateKey;
    this.PublicKey = data?.PublicKey;
    this.PublicKeyCheckEncode = data?.PublicKeyCheckEncode;
    this.PublicKeyBytes = data?.PublicKeyBytes;
    this.BLSPublicKey = data?.BLSPublicKey;
    // this.BlockProducerKey = data?.BlockProducerKey;
    this.ValidatorKey = data?.ValidatorKey;
    this.OTAKey = data?.OTAKey;
    this.PaymentAddressV1 = data?.PaymentAddressV1;
    this.ID = data.ID;
    this.accountName = data?.AccountName || data?.name;
  }

  toJSON() {
    return {
      name: this.name,
      AccountName: this.name,
      value: this.value,
      PaymentAddress: this.PaymentAddress,
      ReadonlyKey: this.ReadonlyKey,
      PrivateKey: this.PrivateKey,
      PublicKey: this.PublicKey,
      PublicKeyCheckEncode: this.PublicKeyCheckEncode,
      PublicKeyBytes: this.PublicKeyBytes,
      BLSPublicKey: this.BLSPublicKey,
      ValidatorKey: this.ValidatorKey,
      PaymentAddressV1: this.PaymentAddressV1,
    };
  }
}

export default Account;
