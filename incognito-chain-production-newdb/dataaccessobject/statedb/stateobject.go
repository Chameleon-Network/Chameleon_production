package statedb

import (
	"bytes"
	"encoding/binary"
	"github.com/incognitochain/incognito-chain/common"
)

type StateObject interface {
	GetVersion() int
	GetValue() interface{}
	GetValueBytes() []byte
	GetHash() common.Hash
	GetType() int
	SetValue(interface{}) error
	GetTrie(DatabaseAccessWarper) Trie
	SetError(error)
	MarkDelete()
	IsDeleted() bool
	IsEmpty() bool
	Reset() bool
}

const (
	TYPE_LENGTH   = 8
	STATUS_LENGTH = 2
	KEY_LENGTH    = 32
)

// ByteSerialize return a list of byte in format of:
// 0-7: for type
// 8-9: for status
// 10-41: for key
// 42-end: for value
func ByteSerialize(sob StateObject) []byte {

	res := []byte{}

	// first 8 byte for type
	var objTypeByte = make([]byte, 8)
	binary.LittleEndian.PutUint64(objTypeByte, uint64(sob.GetType()))
	res = append(res, objTypeByte[:]...)

	// next 2 to byte for status
	var isDeleteByte = make([]byte, 2)
	var bitDelete uint16
	if sob.IsDeleted() {
		bitDelete = 1
	}
	binary.LittleEndian.PutUint16(isDeleteByte, bitDelete)
	res = append(res, isDeleteByte[:]...)

	// next 32 byte is key
	res = append(res, sob.GetHash().Bytes()...)

	// the rest is value
	res = append(res, sob.GetValueBytes()...)

	return res
}

func ByteDeSerialize(stateDB *StateDB, sobByte []byte) (StateObject, error) {

	objTypeByte := sobByte[:TYPE_LENGTH]
	var objType uint64

	if err := binary.Read(bytes.NewBuffer(objTypeByte), binary.LittleEndian, &objType); err != nil {
		return nil, err
	}

	objStatusByte := sobByte[TYPE_LENGTH : TYPE_LENGTH+STATUS_LENGTH]
	var objStatusBit uint16
	var objStatus = false

	if err := binary.Read(bytes.NewBuffer(objStatusByte), binary.LittleEndian, &objStatusBit); err != nil {
		return nil, err
	}

	if objStatusBit == 1 {
		objStatus = true
	}

	objKeyByte := sobByte[TYPE_LENGTH+STATUS_LENGTH : TYPE_LENGTH+STATUS_LENGTH+KEY_LENGTH]
	objKey, err := common.Hash{}.NewHash(objKeyByte)
	if err != nil {
		return nil, err
	}

	objValue := sobByte[TYPE_LENGTH+STATUS_LENGTH+KEY_LENGTH:]

	sob, err := newStateObjectWithValue(stateDB, int(objType), *objKey, objValue)
	if err != nil {
		return nil, err
	}

	if objStatus {
		sob.MarkDelete()
	}

	return sob, nil
}

func MapByteSerialize(m map[common.Hash]StateObject) []byte {

	res := []byte{}

	for _, v := range m {
		b := ByteSerialize(v)
		offset := make([]byte, 4)
		binary.LittleEndian.PutUint32(offset, uint32(len(b)))
		res = append(res, offset...)
		res = append(res, b...)
	}

	return res
}

func MapByteDeserialize(stateDB *StateDB, data []byte) (map[common.Hash]StateObject, error) {

	m := make(map[common.Hash]StateObject)

	for len(data) > 0 {

		offsetByte := data[:4]
		offset := binary.LittleEndian.Uint32(offsetByte)
		data = data[4:]

		soByte := data[:offset]
		stateObject, err := ByteDeSerialize(stateDB, soByte)
		if err != nil {
			return m, err
		}
		data = data[offset:]

		m[stateObject.GetHash()] = stateObject
	}

	return m, nil
}

func newStateObjectWithValue(db *StateDB, objectType int, hash common.Hash, value interface{}) (StateObject, error) {
	switch objectType {
	case TestObjectType:
		return newTestObjectWithValue(db, hash, value)
	case CommitteeObjectType:
		return newCommitteeObjectWithValue(db, hash, value)
	case CommitteeRewardObjectType:
		return newCommitteeRewardObjectWithValue(db, hash, value)
	case RewardRequestObjectType:
		return newRewardRequestObjectWithValue(db, hash, value)
	case RewardRequestV3ObjectType:
		return newRewardRequestMultisetObjectWithValue(db, hash, value)
	case BlackListProducerObjectType:
		return newBlackListProducerObjectWithValue(db, hash, value)
	case TokenObjectType:
		return newTokenObjectWithValue(db, hash, value)
	case SerialNumberObjectType:
		return newSerialNumberObjectWithValue(db, hash, value)
	case CommitmentObjectType:
		return newCommitmentObjectWithValue(db, hash, value)
	case CommitmentIndexObjectType:
		return newCommitmentIndexObjectWithValue(db, hash, value)
	case CommitmentLengthObjectType:
		return newCommitmentLengthObjectWithValue(db, hash, value)
	case OutputCoinObjectType:
		return newOutputCoinObjectWithValue(db, hash, value)
	case OTACoinObjectType:
		return newOTACoinObjectWithValue(db, hash, value)
	case OTACoinIndexObjectType:
		return newOTACoinIndexObjectWithValue(db, hash, value)
	case OTACoinLengthObjectType:
		return newOTACoinLengthObjectWithValue(db, hash, value)
	case OnetimeAddressObjectType:
		return newOnetimeAddressObjectWithValue(db, hash, value)
	case SNDerivatorObjectType:
		return newSNDerivatorObjectWithValue(db, hash, value)
	case WaitingPDEContributionObjectType:
		return newWaitingPDEContributionObjectWithValue(db, hash, value)
	case PDEPoolPairObjectType:
		return newPDEPoolPairObjectWithValue(db, hash, value)
	case PDEShareObjectType:
		return newPDEShareObjectWithValue(db, hash, value)
	case PDETradingFeeObjectType:
		return newPDETradingFeeObjectWithValue(db, hash, value)
	case PDEStatusObjectType:
		return newPDEStatusObjectWithValue(db, hash, value)
	case BridgeEthTxObjectType:
		return newBridgeEthTxObjectWithValue(db, hash, value)
	case BridgeBSCTxObjectType:
		return newBridgeBSCTxObjectWithValue(db, hash, value)
	case BridgePRVEVMObjectType:
		return newBrigePRVEVMObjectWithValue(db, hash, value)
	case BridgeTokenInfoObjectType:
		return newBridgeTokenInfoObjectWithValue(db, hash, value)
	case BridgeStatusObjectType:
		return newBridgeStatusObjectWithValue(db, hash, value)
	case BurningConfirmObjectType:
		return newBurningConfirmObjectWithValue(db, hash, value)
	case TokenTransactionObjectType:
		return newTokenTransactionObjectWithValue(db, hash, value)
	case PortalFinalExchangeRatesStateObjectType:
		return newFinalExchangeRatesStateObjectWithValue(db, hash, value)
	case PortalUnlockOverRateCollaterals:
		return newUnlockOverRateCollateralsStateObjectWithValue(db, hash, value)
	case PortalLiquidationPoolObjectType:
		return newLiquidationPoolObjectWithValue(db, hash, value)
	case PortalWaitingPortingRequestObjectType:
		return newWaitingPortingRequestObjectWithValue(db, hash, value)
	case PortalStatusObjectType:
		return newPortalStatusObjectWithValue(db, hash, value)
	case PortalRewardInfoObjectType:
		return newPortalRewardInfoObjectWithValue(db, hash, value)
	case WaitingRedeemRequestObjectType:
		return newRedeemRequestObjectWithValue(db, hash, value)
	case CustodianStateObjectType:
		return newCustodianStateObjectWithValue(db, hash, value)
	case LockedCollateralStateObjectType:
		return newLockedCollateralStateObjectWithValue(db, hash, value)
	case RewardFeatureStateObjectType:
		return newRewardFeatureStateObjectWithValue(db, hash, value)
	case PortalExternalTxObjectType:
		return newPortalExternalTxObjectWithValue(db, hash, value)
	case PortalConfirmProofObjectType:
		return newPortalConfirmProofStateObjectWithValue(db, hash, value)
	case StakerObjectType:
		return newStakerObjectWithValue(db, hash, value)
	case PortalV4StatusObjectType:
		return newPortalV4StatusObjectWithValue(db, hash, value)
	case PortalV4UTXOObjectType:
		return newUTXOObjectWithValue(db, hash, value)
	case PortalV4ShieldRequestObjectType:
		return newShieldingRequestObjectWithValue(db, hash, value)
	case PortalWaitingUnshieldObjectType:
		return newWaitingUnshieldObjectWithValue(db, hash, value)
	case PortalProcessedUnshieldRequestBatchObjectType:
		return newProcessUnshieldRequestBatchObjectWithValue(db, hash, value)
	case SlashingCommitteeObjectType:
		return newSlashingCommitteeObjectWithValue(db, hash, value)
	case Pdexv3StatusObjectType:
		return newPdexv3StatusObjectWithValue(db, hash, value)
	case Pdexv3ParamsObjectType:
		return newPdexv3ParamsObjectWithValue(db, hash, value)
	case Pdexv3ContributionObjectType:
		return newPdexv3ContributionObjectWithValue(db, hash, value)
	case Pdexv3PoolPairObjectType:
		return newPdexv3PoolPairObjectWithValue(db, hash, value)
	case Pdexv3ShareObjectType:
		return newPdexv3ShareObjectWithValue(db, hash, value)
	case Pdexv3NftObjectType:
		return newPdexv3NftObjectWithValue(db, hash, value)
	case Pdexv3OrderObjectType:
		return newPdexv3OrderObjectWithValue(db, hash, value)
	case Pdexv3PoolPairLpFeePerShareObjectType:
		return newPdexv3PoolPairLpFeePerShareObjectWithValue(db, hash, value)
	case Pdexv3PoolPairProtocolFeeObjectType:
		return newPdexv3PoolPairProtocolFeeObjectWithValue(db, hash, value)
	case Pdexv3PoolPairStakingPoolFeeObjectType:
		return newPdexv3PoolPairStakingPoolFeeObjectWithValue(db, hash, value)
	case Pdexv3ShareTradingFeeObjectType:
		return newPdexv3ShareTradingFeeObjectWithValue(db, hash, value)
	case Pdexv3ShareLastLPFeesPerShareObjectType:
		return newPdexv3ShareLastLpFeePerShareObjectWithValue(db, hash, value)
	case Pdexv3StakingPoolRewardPerShareObjectType:
		return newPdexv3StakingPoolRewardPerShareObjectWithValue(db, hash, value)
	case Pdexv3StakerRewardObjectType:
		return newPdexv3StakerRewardObjectWithValue(db, hash, value)
	case Pdexv3StakerLastRewardPerShareObjectType:
		return newPdexv3StakerLastRewardPerShareObjectWithValue(db, hash, value)
	case Pdexv3StakerObjectType:
		return newPdexv3StakerObjectWithValue(db, hash, value)
	case Pdexv3PoolPairMakingVolumeObjectType:
		return newPdexv3PoolPairMakingVolumeObjectWithValue(db, hash, value)
	case Pdexv3PoolPairOrderRewardObjectType:
		return newPdexv3PoolPairOrderRewardObjectWithValue(db, hash, value)
	case Pdexv3ShareLastLmRewardPerShareObjectType:
		return newPdexv3ShareLastLmRewardPerShareObjectWithValue(db, hash, value)
	case Pdexv3PoolPairLmRewardPerShareObjectType:
		return newPdexv3PoolPairLmRewardPerShareObjectWithValue(db, hash, value)
	case Pdexv3PoolPairLmLockedShareObjectType:
		return newPdexv3PoolPairLmLockedShareObjectWithValue(db, hash, value)
	case BridgePLGTxObjectType:
		return newBridgePLGTxObjectWithValue(db, hash, value)
	case BridgeFTMTxObjectType:
		return newBridgeFTMTxObjectWithValue(db, hash, value)
	case BridgeAggUnifiedTokenObjectType:
		return newBridgeAggUnifiedTokenObjectWithValue(db, hash, value)
	case BridgeAggStatusObjectType:
		return newBridgeAggStatusObjectWithValue(db, hash, value)
	case BridgeAggVaultObjectType:
		return newBridgeAggVaultObjectWithValue(db, hash, value)
	case BridgeAggWaitingUnshieldReqObjectType:
		return newBridgeAggWaitingUnshieldReqObjectWithValue(db, hash, value)
	case BridgeAggParamObjectType:
		return newBridgeAggParamObjectWithValue(db, hash, value)

	default:
		panic("state object type not exist")
	}
}

func newStateObject(db *StateDB, objectType int, hash common.Hash) StateObject {
	switch objectType {
	case TestObjectType:
		return newTestObject(db, hash)
	case CommitteeObjectType:
		return newCommitteeObject(db, hash)
	case CommitteeRewardObjectType:
		return newCommitteeRewardObject(db, hash)
	case RewardRequestObjectType:
		return newRewardRequestObject(db, hash)
	case RewardRequestV3ObjectType:
		return newRewardRequestMultisetObject(db, hash)
	case BlackListProducerObjectType:
		return newBlackListProducerObject(db, hash)
	case SerialNumberObjectType:
		return newSerialNumberObject(db, hash)
	case CommitmentObjectType:
		return newCommitteeObject(db, hash)
	case CommitmentIndexObjectType:
		return newCommitmentIndexObject(db, hash)
	case CommitmentLengthObjectType:
		return newCommitmentLengthObject(db, hash)
	case SNDerivatorObjectType:
		return newSNDerivatorObject(db, hash)
	case OTACoinObjectType:
		return newOTACoinObject(db, hash)
	case OTACoinIndexObjectType:
		return newOTACoinIndexObject(db, hash)
	case OTACoinLengthObjectType:
		return newOTACoinLengthObject(db, hash)
	case OnetimeAddressObjectType:
		return newOnetimeAddressObject(db, hash)
	case WaitingPDEContributionObjectType:
		return newWaitingPDEContributionObject(db, hash)
	case PDEPoolPairObjectType:
		return newPDEPoolPairObject(db, hash)
	case PDEShareObjectType:
		return newPDEShareObject(db, hash)
	case PDETradingFeeObjectType:
		return newPDETradingFeeObject(db, hash)
	case PDEStatusObjectType:
		return newPDEStatusObject(db, hash)
	case BridgeEthTxObjectType:
		return newBridgeEthTxObject(db, hash)
	case BridgeBSCTxObjectType:
		return newBridgeBSCTxObject(db, hash)
	case BridgePRVEVMObjectType:
		return newBrigePRVEVMObject(db, hash)
	case BridgeTokenInfoObjectType:
		return newBridgeTokenInfoObject(db, hash)
	case BridgeStatusObjectType:
		return newBridgeStatusObject(db, hash)
	case BurningConfirmObjectType:
		return newBurningConfirmObject(db, hash)
	case PortalFinalExchangeRatesStateObjectType:
		return newFinalExchangeRatesStateObject(db, hash)
	case PortalUnlockOverRateCollaterals:
		return newUnlockOverRateCollateralsStateObject(db, hash)
	case PortalLiquidationPoolObjectType:
		return newLiquidationPoolObject(db, hash)
	case PortalWaitingPortingRequestObjectType:
		return newWaitingPortingRequestObject(db, hash)
	case PortalStatusObjectType:
		return newPortalStatusObject(db, hash)
	case PortalRewardInfoObjectType:
		return newPortalRewardInfoObject(db, hash)
	case WaitingRedeemRequestObjectType:
		return newRedeemRequestObject(db, hash)
	case CustodianStateObjectType:
		return newCustodianStateObject(db, hash)
	case LockedCollateralStateObjectType:
		return newLockedCollateralStateObject(db, hash)
	case RewardFeatureStateObjectType:
		return newRewardFeatureStateObject(db, hash)
	case PortalExternalTxObjectType:
		return newPortalExternalTxObject(db, hash)
	case PortalConfirmProofObjectType:
		return newPortalConfirmProofStateObject(db, hash)
	case StakerObjectType:
		return newStakerObject(db, hash)
	case PortalV4StatusObjectType:
		return newPortalV4StatusObject(db, hash)
	case PortalV4UTXOObjectType:
		return newUTXOObject(db, hash)
	case PortalV4ShieldRequestObjectType:
		return newShieldingRequestObject(db, hash)
	case PortalWaitingUnshieldObjectType:
		return newWaitingUnshieldObject(db, hash)
	case PortalProcessedUnshieldRequestBatchObjectType:
		return newProcessUnshieldRequestBatchObject(db, hash)
	case SlashingCommitteeObjectType:
		return newSlashingCommitteeObject(db, hash)
	case Pdexv3StatusObjectType:
		return newPdexv3StatusObject(db, hash)
	case Pdexv3ParamsObjectType:
		return newPdexv3ParamsObject(db, hash)
	case Pdexv3ContributionObjectType:
		return newPdexv3ContributionObject(db, hash)
	case Pdexv3PoolPairObjectType:
		return newPdexv3PoolPairObject(db, hash)
	case Pdexv3ShareObjectType:
		return newPdexv3StatusObject(db, hash)
	case Pdexv3NftObjectType:
		return newPdexv3NftObject(db, hash)
	case Pdexv3OrderObjectType:
		return newPdexv3OrderObject(db, hash)
	case Pdexv3PoolPairLpFeePerShareObjectType:
		return newPdexv3PoolPairLpFeePerShareObject(db, hash)
	case Pdexv3PoolPairProtocolFeeObjectType:
		return newPdexv3PoolPairProtocolFeeObject(db, hash)
	case Pdexv3PoolPairStakingPoolFeeObjectType:
		return newPdexv3PoolPairStakingPoolFeeObject(db, hash)
	case Pdexv3ShareTradingFeeObjectType:
		return newPdexv3ShareTradingFeeObject(db, hash)
	case Pdexv3ShareLastLPFeesPerShareObjectType:
		return newPdexv3ShareLastLpFeePerShareObject(db, hash)
	case Pdexv3StakingPoolRewardPerShareObjectType:
		return newPdexv3StakingPoolRewardPerShareObject(db, hash)
	case Pdexv3StakerRewardObjectType:
		return newPdexv3StakerRewardObject(db, hash)
	case Pdexv3StakerLastRewardPerShareObjectType:
		return newPdexv3StakerLastRewardPerShareObject(db, hash)
	case Pdexv3StakerObjectType:
		return newPdexv3StakerObject(db, hash)
	case Pdexv3PoolPairMakingVolumeObjectType:
		return newPdexv3PoolPairMakingVolumeObject(db, hash)
	case Pdexv3PoolPairOrderRewardObjectType:
		return newPdexv3PoolPairOrderRewardObject(db, hash)
	case Pdexv3ShareLastLmRewardPerShareObjectType:
		return newPdexv3ShareLastLmRewardPerShareObject(db, hash)
	case Pdexv3PoolPairLmRewardPerShareObjectType:
		return newPdexv3PoolPairLmRewardPerShareObject(db, hash)
	case Pdexv3PoolPairLmLockedShareObjectType:
		return newPdexv3PoolPairLmLockedShareObject(db, hash)
	case BridgePLGTxObjectType:
		return newBridgePLGTxObject(db, hash)
	case BridgeFTMTxObjectType:
		return newBridgeFTMTxObject(db, hash)
	case BridgeAggUnifiedTokenObjectType:
		return newBridgeAggUnifiedTokenObject(db, hash)
	case BridgeAggStatusObjectType:
		return newBridgeAggStatusObject(db, hash)
	case BridgeAggVaultObjectType:
		return newBridgeAggVaultObject(db, hash)
	case BridgeAggWaitingUnshieldReqObjectType:
		return newBridgeAggWaitingUnshieldReqObject(db, hash)
	case BridgeAggParamObjectType:
		return newBridgeAggParamObject(db, hash)
	default:
		panic("state object type not exist")
	}
}
