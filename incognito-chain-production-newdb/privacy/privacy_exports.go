package privacy

import (
	"fmt"

	"github.com/incognitochain/incognito-chain/common"
	"github.com/incognitochain/incognito-chain/privacy/coin"
	errhandler "github.com/incognitochain/incognito-chain/privacy/errorhandler"
	"github.com/incognitochain/incognito-chain/privacy/key"
	"github.com/incognitochain/incognito-chain/privacy/operation"
	"github.com/incognitochain/incognito-chain/privacy/privacy_util"
	"github.com/incognitochain/incognito-chain/privacy/privacy_v1/hybridencryption"
	"github.com/incognitochain/incognito-chain/privacy/privacy_v1/schnorr"
	zkp "github.com/incognitochain/incognito-chain/privacy/privacy_v1/zeroknowledge"
	"github.com/incognitochain/incognito-chain/privacy/privacy_v1/zeroknowledge/aggregatedrange"
	"github.com/incognitochain/incognito-chain/privacy/privacy_v2"
	"github.com/incognitochain/incognito-chain/privacy/privacy_v2/bulletproofs"
	"github.com/incognitochain/incognito-chain/privacy/proof"
	"github.com/incognitochain/incognito-chain/privacy/proof/agg_interface"
)

type PrivacyError = errhandler.PrivacyError //nolint:revive

var ErrCodeMessage = errhandler.ErrCodeMessage

// Public Constants
const (
	CStringBurnAddress    = "burningaddress"
	Ed25519KeySize        = operation.Ed25519KeySize
	CStringBulletProof    = operation.CStringBulletProof
	CommitmentRingSize    = privacy_util.CommitmentRingSize
	CommitmentRingSizeExp = privacy_util.CommitmentRingSizeExp

	PedersenSndIndex        = operation.PedersenSndIndex
	PedersenValueIndex      = operation.PedersenValueIndex
	PedersenShardIDIndex    = operation.PedersenShardIDIndex
	PedersenPrivateKeyIndex = operation.PedersenPrivateKeyIndex
	PedersenRandomnessIndex = operation.PedersenRandomnessIndex

	RingSize           = privacy_util.RingSize
	MaxPrivacyAttempts = coin.MaxAttempts
	TxRandomGroupSize  = coin.TxRandomGroupSize

	CoinPrivacyTypeTransfer = coin.PrivacyTypeTransfer
	CoinPrivacyTypeMint     = coin.PrivacyTypeMint
)

var PedCom = operation.PedCom

const (
	MaxSizeInfoCoin = coin.MaxSizeInfoCoin // byte
)

// Export as package privacy for other packages easily use it

type Point = operation.Point
type Scalar = operation.Scalar
type HybridCipherText = hybridencryption.HybridCipherText

// Point and Scalar operations
func RandomScalar() *Scalar {
	return operation.RandomScalar()
}

func HashToPoint(b []byte) *Point {
	return operation.HashToPoint(b)
}

func HashToScalar(data []byte) *Scalar {
	return operation.HashToScalar(data)
}

type PublicKey = key.PublicKey
type TransmissionKey = key.TransmissionKey
type ViewingKey = key.ViewingKey
type PrivateKey = key.PrivateKey
type OTAKey = key.OTAKey
type PaymentInfo = key.PaymentInfo
type PaymentAddress = key.PaymentAddress

func GeneratePrivateKey(seed []byte) PrivateKey {
	return key.GeneratePrivateKey(seed)
}

func GeneratePaymentAddress(privateKey []byte) PaymentAddress {
	return key.GeneratePaymentAddress(privateKey)
}

func GenerateViewingKey(privateKey []byte) ViewingKey {
	return key.GenerateViewingKey(privateKey)
}

type SchnSignature = schnorr.SchnSignature
type SchnorrPublicKey = schnorr.SchnorrPublicKey
type SchnorrPrivateKey = schnorr.SchnorrPrivateKey

type Coin = coin.Coin
type PlainCoin = coin.PlainCoin
type PlainCoinV1 = coin.PlainCoinV1
type CoinV1 = coin.CoinV1
type CoinV2 = coin.CoinV2
type CoinObject = coin.CoinObject
type TxRandom = coin.TxRandom
type OTAReceiver = coin.OTAReceiver

type Proof = proof.Proof
type ProofV1 = zkp.PaymentProof
type PaymentWitnessParam = zkp.PaymentWitnessParam
type PaymentWitness = zkp.PaymentWitness
type ProofV2 = privacy_v2.PaymentProofV2
type ProofForConversion = privacy_v2.ConversionProofVer1ToVer2
type AggregatedRangeProof = agg_interface.AggregatedRangeProof
type AggregatedRangeProofV1 = aggregatedrange.AggregatedRangeProof
type AggregatedRangeProofV2 = bulletproofs.AggregatedRangeProof

var LoggerV1 = &zkp.Logger
var LoggerV2 = &privacy_v2.Logger

func NewProofWithVersion(version int8) Proof {
	var result Proof
	if version == 1 {
		result = &zkp.PaymentProof{}
	} else {
		result = &privacy_v2.PaymentProofV2{}
	}
	return result
}

func ArrayScalarToBytes(arr *[]*operation.Scalar) ([]byte, error) {
	scalarArr := *arr

	n := len(scalarArr)
	if n > 255 {
		return nil, fmt.Errorf("arrayScalarToBytes: length of scalar array is too big")
	}
	b := make([]byte, 1)
	b[0] = byte(n)

	for _, sc := range scalarArr {
		b = append(b, sc.ToBytesS()...)
	}
	return b, nil
}

func ArrayScalarFromBytes(b []byte) (*[]*operation.Scalar, error) {
	if len(b) == 0 {
		return nil, fmt.Errorf("arrayScalarFromBytes error: length of byte is 0")
	}
	n := int(b[0])
	if n*Ed25519KeySize+1 != len(b) {
		return nil, fmt.Errorf("arrayScalarFromBytes error: length of byte is not correct")
	}
	scalarArr := make([]*operation.Scalar, n)
	offset := 1
	for i := 0; i < n; i++ {
		curByte := b[offset : offset+Ed25519KeySize]
		scalarArr[i] = new(operation.Scalar).FromBytesS(curByte)
		offset += Ed25519KeySize
	}
	return &scalarArr, nil
}

func CheckDuplicateScalarArray(arr []*Scalar) bool {
	return operation.CheckDuplicateScalarArray(arr)
}

func RandomPoint() *Point {
	return operation.RandomPoint()
}
func IsPointEqual(pa *Point, pb *Point) bool {
	return operation.IsPointEqual(pa, pb)
}
func IsScalarEqual(pa *Scalar, pb *Scalar) bool {
	return operation.IsScalarEqual(pa, pb)
}

func NewCoinFromPaymentInfo(p *coin.CoinParams) (*CoinV2, error) {
	return coin.NewCoinFromPaymentInfo(p)
}

func NewCoinFromAmountAndTxRandomBytes(amount uint64, publicKey *operation.Point, txRandom *TxRandom, info []byte) *CoinV2 {
	return coin.NewCoinFromAmountAndTxRandomBytes(amount, publicKey, txRandom, info)
}

func ProveV2(inputCoins []PlainCoin, outputCoins []*CoinV2, sharedSecrets []*Point, hasPrivacy bool, paymentInfo []*PaymentInfo) (*ProofV2, error) {
	return privacy_v2.Prove(inputCoins, outputCoins, sharedSecrets, hasPrivacy, paymentInfo)
}

func ComputeAssetTagBlinder(sharedSecret *Point) (*Scalar, error) {
	return coin.ComputeAssetTagBlinder(sharedSecret)
}

func NewCoinCA(p *coin.CoinParams, tokenID *common.Hash) (*CoinV2, *Point, error) {
	return coin.NewCoinCA(p, tokenID)
}

func NewCoinParams() *coin.CoinParams { return &coin.CoinParams{} }

var DeriveShardInfoFromCoin = coin.DeriveShardInfoFromCoin
