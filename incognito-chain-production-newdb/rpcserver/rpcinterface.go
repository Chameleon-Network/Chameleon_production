package rpcserver

import "github.com/incognitochain/incognito-chain/rpcserver/rpcservice"

type httpHandler func(*HttpServer, interface{}, <-chan struct{}) (interface{}, *rpcservice.RPCError)
type wsHandler func(*WsServer, interface{}, string, chan RpcSubResult, <-chan struct{})

// Commands valid for normal user
var HttpHandler = map[string]httpHandler{
	//Test Rpc Server
	testHttpServer: (*HttpServer).handleTestHttpServer,

	//profiling
	startProfiling: (*HttpServer).handleStartProfiling,
	stopProfiling:  (*HttpServer).handleStopProfiling,
	exportMetrics:  (*HttpServer).handleExportMetrics,

	// node
	getNodeRole:              (*HttpServer).handleGetNodeRole,
	getNetworkInfo:           (*HttpServer).handleGetNetWorkInfo,
	getConnectionCount:       (*HttpServer).handleGetConnectionCount,
	getAllConnectedPeers:     (*HttpServer).handleGetAllConnectedPeers,
	getInOutMessages:         (*HttpServer).handleGetInOutMessages,
	getInOutMessageCount:     (*HttpServer).handleGetInOutMessageCount,
	getAllPeers:              (*HttpServer).handleGetAllPeers,
	estimateFee:              (*HttpServer).handleEstimateFee,
	estimateFeeWithEstimator: (*HttpServer).handleEstimateFeeWithEstimator,
	getActiveShards:          (*HttpServer).handleGetActiveShards,
	getMaxShardsNumber:       (*HttpServer).handleGetMaxShardsNumber,

	//tx pool
	getRawMempool:              (*HttpServer).handleGetRawMempool,
	getSyncPoolValidator:       (*HttpServer).handleGetSyncPoolValidator,
	getSyncPoolValidatorDetail: (*HttpServer).handleGetSyncPoolValidatorDetail,
	getNumberOfTxsInMempool:    (*HttpServer).handleGetNumberOfTxsInMempool,
	getMempoolEntry:            (*HttpServer).handleMempoolEntry,
	removeTxInMempool:          (*HttpServer).handleRemoveTxInMempool,
	getMempoolInfo:             (*HttpServer).handleGetMempoolInfo,
	getPendingTxsInBlockgen:    (*HttpServer).handleGetPendingTxsInBlockgen,

	// block pool ver.2
	// getCrossShardPoolStateV2:    (*HttpServer).handleGetCrossShardPoolStateV2,
	// getShardPoolStateV2:         (*HttpServer).handleGetShardPoolStateV2,
	// getBeaconPoolStateV2:        (*HttpServer).handleGetBeaconPoolStateV2,
	// // ver.1
	// //getCrossShardPoolState:    (*HttpServer).handleGetCrossShardPoolState,
	// getNextCrossShard: (*HttpServer).handleGetNextCrossShard,

	//backup and preload
	setBackup:       (*HttpServer).handleSetBackup,
	getLatestBackup: (*HttpServer).handleGetLatestBackup,
	// block
	getBestBlock:                (*HttpServer).handleGetBestBlock,
	getBestBlockHash:            (*HttpServer).handleGetBestBlockHash,
	retrieveBlock:               (*HttpServer).handleRetrieveBlock,
	retrieveBlockByHeight:       (*HttpServer).handleRetrieveBlockByHeight,
	retrieveBeaconBlock:         (*HttpServer).handleRetrieveBeaconBlock,
	retrieveBeaconBlockByHeight: (*HttpServer).handleRetrieveBeaconBlockByHeight,
	getBlocks:                   (*HttpServer).handleGetBlocks,
	getBlockChainInfo:           (*HttpServer).handleGetBlockChainInfo,
	getBlockCount:               (*HttpServer).handleGetBlockCount,
	getBlockHash:                (*HttpServer).handleGetBlockHash,
	checkHashValue:              (*HttpServer).handleCheckHashValue, // get data in blockchain from hash value
	getBlockHeader:              (*HttpServer).handleGetBlockHeader, // Current committee, next block committee and candidate is included in block header
	getCrossShardBlock:          (*HttpServer).handleGetCrossShardBlock,
	getBlocksFromHeight:         (*HttpServer).handleGetBlocksFromHeight,

	// transaction
	listOutputCoins:                         (*HttpServer).handleListOutputCoins,
	listOutputCoinsFromCache:                (*HttpServer).handleListOutputCoinsFromCache,
	listOutputTokens:                        (*HttpServer).handleListOutputCoins,
	createRawTransaction:                    (*HttpServer).handleCreateRawTransaction,
	sendRawTransaction:                      (*HttpServer).handleSendRawTransaction,
	createConvertCoinVer1ToVer2Transaction:  (*HttpServer).handleCreateConvertCoinVer1ToVer2Transaction,
	createAndSendTransaction:                (*HttpServer).handleCreateAndSendTx,
	getTransactionByHash:                    (*HttpServer).handleGetTransactionByHash,
	getEncodedTransactionsByHashes:          (*HttpServer).handleGetEncodedTransactionsByHashes,
	gettransactionhashbyreceiver:            (*HttpServer).handleGetTransactionHashByReceiver,
	gettransactionhashbyreceiverv2:          (*HttpServer).handleGetTransactionHashByReceiverV2,
	gettransactionbyreceiver:                (*HttpServer).handleGetTransactionByReceiver,
	gettransactionbyreceiverv2:              (*HttpServer).handleGetTransactionByReceiverV2,
	gettransactionbyserialnumber:            (*HttpServer).handleGetTransactionBySerialNumber,
	gettransactionbypublickey:               (*HttpServer).handleGetTransactionHashPublicKey,
	createAndSendStakingTransaction:         (*HttpServer).handleCreateAndSendStakingTx,
	createAndSendStopAutoStakingTransaction: (*HttpServer).handleCreateAndSendStopAutoStakingTransaction,
	createAndSendTokenInitTransaction:       (*HttpServer).handleCreateAndSendTokenInitTx,
	randomCommitments:                       (*HttpServer).handleRandomCommitments,
	hasSerialNumbers:                        (*HttpServer).handleHasSerialNumbers,
	hasSnDerivators:                         (*HttpServer).handleHasSnDerivators,
	listSerialNumbers:                       (*HttpServer).handleListSerialNumbers,
	listCommitments:                         (*HttpServer).handleListCommitments,
	listCommitmentIndices:                   (*HttpServer).handleListCommitmentIndices,
	decryptoutputcoinbykeyoftransaction:     (*HttpServer).handleDecryptOutputCoinByKeyOfTransaction,
	randomCommitmentsAndPublicKeys:          (*HttpServer).handleRandomCommitmentsAndPublicKeys,

	createAndSendTransactionV2:                (*HttpServer).handleCreateAndSendTxV2,
	createAndSendStakingTransactionV2:         (*HttpServer).handleCreateAndSendStakingTxV2,
	createAndSendStopAutoStakingTransactionV2: (*HttpServer).handleCreateAndSendStopAutoStakingTransactionV2,
	hasSerialNumbersInMempool:                 (*HttpServer).handleHasSerialNumbersInMempool,

	//======Testing and Benchmark======
	getAndSendTxsFromFile:      (*HttpServer).handleGetAndSendTxsFromFile,
	getAndSendTxsFromFileV2:    (*HttpServer).handleGetAndSendTxsFromFileV2,
	unlockMempool:              (*HttpServer).handleUnlockMempool,
	handleGetConsensusInfoV3:   (*HttpServer).handleGetConsensusInfoV3,
	getAutoStakingByHeight:     (*HttpServer).handleGetAutoStakingByHeight,
	sendFinishSync:             (*HttpServer).handleSendFinishSync,
	setAutoEnableFeatureConfig: (*HttpServer).handleSetAutoEnableFeatureConfig,
	getAutoEnableFeatureConfig: (*HttpServer).handleGetAutoEnableFeatureConfig,
	getCommitteeState:          (*HttpServer).handleGetCommitteeState,
	convertPaymentAddress:      (*HttpServer).handleConvertPaymentAddress,
	getTotalBlockInEpoch:       (*HttpServer).handleGetTotalBlockInEpoch,
	getDetailBlocksOfEpoch:     (*HttpServer).handleGetDetailBlocksOfEpoch,
	getCommitteeStateByShard:   (*HttpServer).handleGetCommitteeStateByShard,
	getSlashingCommittee:       (*HttpServer).handleGetSlashingCommittee,
	getSlashingCommitteeDetail: (*HttpServer).handleGetSlashingCommitteeDetail,
	getFinalityProof:           (*HttpServer).handleGetFinalityProof,
	setConsensusRule:           (*HttpServer).handleSetConsensusRule,
	getConsensusRule:           (*HttpServer).handleGetConsensusRule,
	getByzantineDetectorInfo:   (*HttpServer).handleGetByzantineDetectorInfo,
	getByzantineBlackList:      (*HttpServer).handleGetByzantineBlackList,
	removeByzantineDetector:    (*HttpServer).handleRemoveByzantineDetector,
	getConsensusData:           (*HttpServer).handleGetConsensusData,
	getProposerIndex:           (*HttpServer).handleGetProposerIndex,
	resetCache:                 (*HttpServer).handleResetCache,
	handleTestValidate:         (*HttpServer).handleTestValidate,
	getRootHash: (*HttpServer).handleGetRootHash,
	//=================================

	// Beststate
	getCandidateList:         (*HttpServer).handleGetCandidateList,
	getCommitteeList:         (*HttpServer).handleGetCommitteeList,
	getShardBestState:        (*HttpServer).handleGetShardBestState,
	getShardBestStateDetail:  (*HttpServer).handleGetShardBestStateDetail,
	getBeaconViewByHash:      (*HttpServer).handleGetBeaconViewByHash,
	getBeaconBestState:       (*HttpServer).handleGetBeaconBestState,
	getBeaconBestStateDetail: (*HttpServer).handleGetBeaconBestStateDetail,
	// getBeaconPoolState:            (*HttpServer).handleGetBeaconPoolState,
	// getShardPoolState:             (*HttpServer).handleGetShardPoolState,
	// getShardPoolLatestValidHeight: (*HttpServer).handleGetShardPoolLatestValidHeight,
	canPubkeyStake:      (*HttpServer).handleCanPubkeyStake,
	getTotalTransaction: (*HttpServer).handleGetTotalTransaction,

	// custom token which support privacy
	createConvertCoinVer1ToVer2TxToken:         (*HttpServer).handleCreateConvertCoinVer1ToVer2TxToken,
	createRawPrivacyCustomTokenTransaction:     (*HttpServer).handleCreateRawPrivacyCustomTokenTransaction,
	sendRawPrivacyCustomTokenTransaction:       (*HttpServer).handleSendRawPrivacyCustomTokenTransaction,
	createAndSendPrivacyCustomTokenTransaction: (*HttpServer).handleCreateAndSendPrivacyCustomTokenTransaction,
	listPrivacyCustomToken:                     (*HttpServer).handleListPrivacyCustomToken,
	listPrivacyCustomTokenIDs:                  (*HttpServer).handleListPrivacyCustomTokenIDs,
	getPrivacyCustomToken:                      (*HttpServer).handleGetPrivacyCustomToken,
	listPrivacyCustomTokenByShard:              (*HttpServer).handleListPrivacyCustomTokenByShard,
	privacyCustomTokenTxs:                      (*HttpServer).handlePrivacyCustomTokenDetail,
	getListPrivacyCustomTokenBalance:           (*HttpServer).handleGetListPrivacyCustomTokenBalance,
	getBalancePrivacyCustomToken:               (*HttpServer).handleGetBalancePrivacyCustomToken,
	listUnspentOutputTokens:                    (*HttpServer).handleListUnspentOutputTokens,
	getOTACoinLength:                           (*HttpServer).handleGetOTACoinLength,
	getOTACoinsByIndices:                       (*HttpServer).handleGetOTACoinsByIndices,

	// Bridge
	createIssuingRequest:              (*HttpServer).handleCreateIssuingRequest,
	sendIssuingRequest:                (*HttpServer).handleSendIssuingRequest,
	createAndSendIssuingRequest:       (*HttpServer).handleCreateAndSendIssuingRequest,
	createAndSendIssuingRequestV2:     (*HttpServer).handleCreateAndSendIssuingRequestV2,
	createAndSendContractingRequest:   (*HttpServer).handleCreateAndSendContractingRequest,
	createAndSendContractingRequestV2: (*HttpServer).handleCreateAndSendContractingRequestV2,
	checkETHHashIssued:                (*HttpServer).handleCheckETHHashIssued,
	getAllBridgeTokens:                (*HttpServer).handleGetAllBridgeTokens,
	getAllBridgeTokensByHeight:        (*HttpServer).handleGetAllBridgeTokensByHeight,
	getETHHeaderByHash:                (*HttpServer).handleGetETHHeaderByHash,
	getBridgeReqWithStatus:            (*HttpServer).handleGetBridgeReqWithStatus,
	generateTokenID:                   (*HttpServer).handleGenerateTokenID,
	checkBSCHashIssued:                (*HttpServer).handleCheckBSCHashIssued,
	checkPRVPeggingHashIssued:         (*HttpServer).handleCheckPrvPeggingHashIssued,

	// wallet
	getPublicKeyFromPaymentAddress:        (*HttpServer).handleGetPublicKeyFromPaymentAddress,
	defragmentAccount:                     (*HttpServer).handleDefragmentAccount,
	defragmentAccountV2:                   (*HttpServer).handleDefragmentAccountV2,
	defragmentAccountToken:                (*HttpServer).handleDefragmentAccountToken,
	defragmentAccountTokenV2:              (*HttpServer).handleDefragmentAccountTokenV2,
	getStackingAmount:                     (*HttpServer).handleGetStakingAmount,
	hashToIdenticon:                       (*HttpServer).handleHashToIdenticon,
	createAndSendBurningRequest:           (*HttpServer).handleCreateAndSendBurningRequest,
	createAndSendBurningRequestV2:         (*HttpServer).handleCreateAndSendBurningRequestV2,
	createAndSendTxWithIssuingETHReq:      (*HttpServer).handleCreateAndSendTxWithIssuingETHReq,
	createAndSendTxWithIssuingETHReqV2:    (*HttpServer).handleCreateAndSendTxWithIssuingETHReqV2,
	createAndSendTxWithIssuingBSCReq:      (*HttpServer).handleCreateAndSendTxWithIssuingBSCReq,
	createAndSendTxWithIssuingPRVERC20Req: (*HttpServer).handleCreateAndSendTxWithIssuingPRVERC20Req,
	createAndSendTxWithIssuingPRVBEP20Req: (*HttpServer).handleCreateAndSendTxWithIssuingPRVBEP20Req,
	createAndSendBurningBSCRequest:        (*HttpServer).handleCreateAndSendBurningBSCRequest,
	createAndSendBurningPRVERC20Request:   (*HttpServer).handleCreateAndSendBurningPRVERC20Request,
	createAndSendBurningPRVBEP20Request:   (*HttpServer).handleCreateAndSendBurningPRVBEP20Request,
	createAndSendTxWithIssuingPLGReq:      (*HttpServer).handleCreateAndSendTxWithIssuingPLGReq,
	createAndSendBurningPLGRequest:        (*HttpServer).handleCreateAndSendBurningPLGRequest,
	createAndSendTxWithIssuingFTMReq:      (*HttpServer).handleCreateAndSendTxWithIssuingFTMReq,
	createAndSendBurningFTMRequest:        (*HttpServer).handleCreateAndSendBurningFTMRequest,

	// Incognito -> Ethereum bridge
	getBeaconSwapProof:       (*HttpServer).handleGetBeaconSwapProof,
	getLatestBeaconSwapProof: (*HttpServer).handleGetLatestBeaconSwapProof,
	getBridgeSwapProof:       (*HttpServer).handleGetBridgeSwapProof,
	getLatestBridgeSwapProof: (*HttpServer).handleGetLatestBridgeSwapProof,
	getBurnProof:             (*HttpServer).handleGetBurnProof,
	getBSCBurnProof:          (*HttpServer).handleGetBSCBurnProof,
	getPRVERC20BurnProof:     (*HttpServer).handleGetPRVERC20BurnProof,
	getPRVBEP20BurnProof:     (*HttpServer).handleGetPRVBEP20BurnProof,
	getPLGBurnProof:          (*HttpServer).handleGetPLGBurnProof,
	getFTMBurnProof:          (*HttpServer).handleGetFTMBurnProof,

	//reward
	CreateRawWithDrawTransaction: (*HttpServer).handleCreateAndSendWithDrawTransaction,
	getRewardAmount:              (*HttpServer).handleGetRewardAmount,
	getRewardAmountByPublicKey:   (*HttpServer).handleGetRewardAmountByPublicKey,
	listRewardAmount:             (*HttpServer).handleListRewardAmount,

	// mining info
	getMiningInfo:               (*HttpServer).handleGetMiningInfo,
	enableMining:                (*HttpServer).handleEnableMining,
	getChainMiningStatus:        (*HttpServer).handleGetChainMiningStatus,
	getPublickeyMining:          (*HttpServer).handleGetPublicKeyMining,
	getPublicKeyRole:            (*HttpServer).handleGetPublicKeyRole,
	getRoleByValidatorKey:       (*HttpServer).handleGetValidatorKeyRole,
	getIncognitoPublicKeyRole:   (*HttpServer).handleGetIncognitoPublicKeyRole,
	getMinerRewardFromMiningKey: (*HttpServer).handleGetMinerRewardFromMiningKey,

	// pde
	getPDEState:                                (*HttpServer).handleGetPDEState,
	createAndSendTxWithWithdrawalReq:           (*HttpServer).handleCreateAndSendTxWithWithdrawalReq,
	createAndSendTxWithWithdrawalReqV2:         (*HttpServer).handleCreateAndSendTxWithWithdrawalReqV2,
	createAndSendTxWithPDEFeeWithdrawalReq:     (*HttpServer).handleCreateAndSendTxWithPDEFeeWithdrawalReq,
	createAndSendTxWithPTokenTradeReq:          (*HttpServer).handleCreateAndSendTxWithPTokenTradeReq,
	createAndSendTxWithPTokenCrossPoolTradeReq: (*HttpServer).handleCreateAndSendTxWithPTokenCrossPoolTradeReq,
	createAndSendTxWithPRVTradeReq:             (*HttpServer).handleCreateAndSendTxWithPRVTradeReq,
	createAndSendTxWithPRVCrossPoolTradeReq:    (*HttpServer).handleCreateAndSendTxWithPRVCrossPoolTradeReq,
	createAndSendTxWithPTokenContribution:      (*HttpServer).handleCreateAndSendTxWithPTokenContribution,
	createAndSendTxWithPTokenContributionV2:    (*HttpServer).handleCreateAndSendTxWithPTokenContributionV2,
	createAndSendTxWithPRVContribution:         (*HttpServer).handleCreateAndSendTxWithPRVContribution,
	createAndSendTxWithPRVContributionV2:       (*HttpServer).handleCreateAndSendTxWithPRVContributionV2,
	getPDEContributionStatus:                   (*HttpServer).handleGetPDEContributionStatus,
	getPDEContributionStatusV2:                 (*HttpServer).handleGetPDEContributionStatusV2,
	getPDETradeStatus:                          (*HttpServer).handleGetPDETradeStatus,
	getPDEWithdrawalStatus:                     (*HttpServer).handleGetPDEWithdrawalStatus,
	getPDEFeeWithdrawalStatus:                  (*HttpServer).handleGetPDEFeeWithdrawalStatus,
	convertPDEPrices:                           (*HttpServer).handleConvertPDEPrices,
	extractPDEInstsFromBeaconBlock:             (*HttpServer).handleExtractPDEInstsFromBeaconBlock,
	//

	// pDex v3
	getPdexv3State:                                 (*HttpServer).handleGetPdexv3State,
	createAndSendTxWithPdexv3ModifyParams:          (*HttpServer).handleCreateAndSendTxWithPdexv3ModifyParams,
	getPdexv3ParamsModifyingStatus:                 (*HttpServer).handleGetPdexv3ParamsModifyingRequestStatus,
	pdexv3AddLiquidityV3:                           (*HttpServer).handleAddLiquidityV3,
	pdexv3WithdrawLiquidityV3:                      (*HttpServer).handleWithdrawLiquidityV3,
	getPdexv3ContributionStatus:                    (*HttpServer).handleGetPdexv3ContributionStatus,
	pdexv3TxTrade:                                  (*HttpServer).handlePdexv3TxTradeRequest,
	pdexv3TxAddOrder:                               (*HttpServer).handlePdexv3TxAddOrderRequest,
	pdexv3TxWithdrawOrder:                          (*HttpServer).handlePdexv3TxWithdrawOrderRequest,
	pdexv3GetTradeStatus:                           (*HttpServer).handlePdexv3GetTradeStatus,
	pdexv3GetAddOrderStatus:                        (*HttpServer).handlePdexv3GetAddOrderStatus,
	pdexv3GetWithdrawOrderStatus:                   (*HttpServer).handlePdexv3GetWithdrawOrderStatus,
	pdexv3MintNft:                                  (*HttpServer).handlePdexv3MintNft,
	getPdexv3WithdrawLiquidityStatus:               (*HttpServer).handleGetPdexv3WithdrawLiquidityStatus,
	getPdexv3MintNftStatus:                         (*HttpServer).handleGetPdexv3MintNftStatus,
	pdexv3Staking:                                  (*HttpServer).handlePdexv3Staking,
	getPdexv3EstimatedLPValue:                      (*HttpServer).handleGetPdexv3EstimatedLPValue,
	getPdexv3EstimatedLPPoolReward:                 (*HttpServer).handleGetPdexv3EstimatedLPPoolReward,
	createAndSendTxWithPdexv3WithdrawLPFee:         (*HttpServer).handleCreateAndSendTxWithPdexv3WithdrawLPFee,
	getPdexv3WithdrawalLPFeeStatus:                 (*HttpServer).handleGetPdexv3WithdrawalLPFeeStatus,
	createAndSendTxWithPdexv3WithdrawProtocolFee:   (*HttpServer).handleCreateAndSendTxWithPdexv3WithdrawProtocolFee,
	getPdexv3WithdrawalProtocolFeeStatus:           (*HttpServer).handleGetPdexv3WithdrawalProtocolFeeStatus,
	pdexv3GetStakingStatus:                         (*HttpServer).handleGetPdexv3StakingStatus,
	pdexv3Unstaking:                                (*HttpServer).handlePdexv3Unstaking,
	pdexv3GetUnstakingStatus:                       (*HttpServer).handleGetPdexv3UnstakingStatus,
	getPdexv3EstimatedStakingReward:                (*HttpServer).handleGetPdexv3EstimatedStakingReward,
	getPdexv3EstimatedStakingPoolReward:            (*HttpServer).handleGetPdexv3EstimatedStakingPoolReward,
	createAndSendTxWithPdexv3WithdrawStakingReward: (*HttpServer).handleCreateAndSendTxWithPdexv3WithdrawStakingReward,
	getPdexv3WithdrawalStakingRewardStatus:         (*HttpServer).handleGetPdexv3WithdrawalStakingRewardStatus,
	// bridgeagg method
	bridgeaggState:                       (*HttpServer).handleGetBridgeAggState,
	bridgeaggModifyParam:                 (*HttpServer).handleCreateAndSendTxBridgeAggModifyParamTx,
	bridgeaggStatusModifyParam:           (*HttpServer).handleGetBridgeAggModifyParamStatus,
	bridgeaggConvert:                     (*HttpServer).handleBridgeAggConvert,
	bridgeaggStatusConvert:               (*HttpServer).handleGetBridgeAggConvertStatus,
	bridgeaggShield:                      (*HttpServer).handleBridgeAggShield,
	bridgeaggStatusShield:                (*HttpServer).handleGetBridgeAggShieldStatus,
	bridgeaggUnshield:                    (*HttpServer).handleBridgeAggUnshield,
	bridgeaggStatusUnshield:              (*HttpServer).handleGetBridgeAggUnshieldStatus,
	bridgeaggEstimateFeeByBurntAmount:    (*HttpServer).handleEstimateFeeByBurntAmount,
	bridgeaggEstimateFeeByExpectedAmount: (*HttpServer).handleEstimateFeeByExpectedAmount,
	bridgeaggEstimateReward:              (*HttpServer).handleBridgeAggEstimateReward,
	bridgeaggGetBurnProof:                (*HttpServer).handleBridgeAggGetBurnProof,

	getBurningAddress: (*HttpServer).handleGetBurningAddress,

	// portal
	getPortalState:                                (*HttpServer).handleGetPortalState,
	createAndSendTxWithCustodianDeposit:           (*HttpServer).handleCreateAndSendTxWithCustodianDeposit,
	getPortalCustodianDepositStatus:               (*HttpServer).handleGetPortalCustodianDepositStatus,
	createAndSendRegisterPortingPublicTokens:      (*HttpServer).handleCreateAndSendTxPortingRequest,
	createAndSendTxWithReqPToken:                  (*HttpServer).handleCreateAndSendTxWithReqPToken,
	createAndSendPortalExchangeRates:              (*HttpServer).handleCreateAndSendTxWithPortalExchangeRate,
	getPortalFinalExchangeRates:                   (*HttpServer).handleGetPortalFinalExchangeRates,
	getPortalPortingRequestByKey:                  (*HttpServer).handleGetPortingRequestStatusByTxID,
	getPortalPortingRequestByPortingId:            (*HttpServer).handleGetPortingRequestStatusByPortingId,
	convertExchangeRates:                          (*HttpServer).handleConvertExchangeRates,
	getPortalReqPTokenStatus:                      (*HttpServer).handleGetPortalReqPTokenStatus,
	getPortingRequestFees:                         (*HttpServer).handleGetPortingRequestFees,
	createAndSendTxWithRedeemReq:                  (*HttpServer).handleCreateAndSendTxWithRedeemReq,
	createAndSendTxWithReqUnlockCollateral:        (*HttpServer).handleCreateAndSendTxWithReqUnlockCollateral,
	getPortalReqUnlockCollateralStatus:            (*HttpServer).handleGetPortalReqUnlockCollateralStatus,
	getPortalReqRedeemStatus:                      (*HttpServer).handleGetReqRedeemStatusByRedeemID,
	createAndSendCustodianWithdrawRequest:         (*HttpServer).handleCreateAndSendTxWithCustodianWithdrawRequest,
	getCustodianWithdrawByTxId:                    (*HttpServer).handleGetCustodianWithdrawRequestStatusByTxId,
	getCustodianLiquidationStatus:                 (*HttpServer).handleGetCustodianLiquidationStatus,
	createAndSendTxWithReqWithdrawRewardPortal:    (*HttpServer).handleCreateAndSendTxWithReqWithdrawRewardPortal,
	getLiquidationExchangeRatesPool:               (*HttpServer).handleGetLiquidationExchangeRatesPool,
	createAndSendTxRedeemFromLiquidationPoolV3:    (*HttpServer).handleCreateAndSendTxRedeemFromLiquidationPoolV3,
	createAndSendCustodianTopup:                   (*HttpServer).handleCreateAndSendCustodianTopup,
	createAndSendTopUpWaitingPorting:              (*HttpServer).handleCreateAndSendTopUpWaitingPorting,
	createAndSendCustodianTopupV3:                 (*HttpServer).handleCreateAndSendCustodianTopupV3,
	createAndSendTopUpWaitingPortingV3:            (*HttpServer).handleCreateAndSendTopUpWaitingPortingV3,
	getTopupAmountForCustodian:                    (*HttpServer).handleGetTopupAmountForCustodianState,
	getPortalReward:                               (*HttpServer).handleGetPortalReward,
	getRequestWithdrawPortalRewardStatus:          (*HttpServer).handleGetRequestWithdrawPortalRewardStatus,
	createAndSendTxWithReqMatchingRedeem:          (*HttpServer).handleCreateAndSendTxWithReqMatchingRedeem,
	getReqMatchingRedeemStatus:                    (*HttpServer).handleGetReqMatchingRedeemStatusByTxID,
	getPortalCustodianTopupStatus:                 (*HttpServer).handleGetPortalCustodianTopupStatus,
	getPortalCustodianTopupStatusV3:               (*HttpServer).handleGetPortalCustodianTopupStatusV3,
	getPortalCustodianTopupWaitingPortingStatus:   (*HttpServer).handleGetPortalCustodianTopupWaitingPortingStatus,
	getPortalCustodianTopupWaitingPortingStatusV3: (*HttpServer).handleGetPortalCustodianTopupWaitingPortingStatusV3,
	getAmountTopUpWaitingPorting:                  (*HttpServer).handleGetAmountTopUpWaitingPorting,
	getPortalReqRedeemByTxIDStatus:                (*HttpServer).handleGetReqRedeemStatusByTxID,
	getReqRedeemFromLiquidationPoolByTxIDStatus:   (*HttpServer).handleGetReqRedeemFromLiquidationPoolByTxIDStatus,
	getReqRedeemFromLiquidationPoolByTxIDStatusV3: (*HttpServer).handleGetReqRedeemFromLiquidationPoolByTxIDStatusV3,
	createAndSendTxWithCustodianDepositV3:         (*HttpServer).handleCreateAndSendTxWithCustodianDepositV3,
	getPortalCustodianDepositStatusV3:             (*HttpServer).handleGetPortalCustodianDepositStatusV3,
	checkPortalExternalHashSubmitted:              (*HttpServer).handleCheckPortalExternalHashSubmitted,
	createAndSendTxWithCustodianWithdrawRequestV3: (*HttpServer).handleCreateAndSendTxWithCustodianWithdrawRequestV3,
	getCustodianWithdrawRequestStatusV3ByTxId:     (*HttpServer).handleGetCustodianWithdrawRequestStatusV3ByTxId,
	getPortalWithdrawCollateralProof:              (*HttpServer).handleGetPortalWithdrawCollateralProof,
	createAndSendUnlockOverRateCollaterals:        (*HttpServer).handleCreateAndSendTxWithPortalCusUnlockOverRateCollaterals,
	getPortalUnlockOverRateCollateralsStatus:      (*HttpServer).handleGetPortalReqUnlockOverRateCollateralStatus,

	// relaying
	createAndSendTxWithRelayingBNBHeader: (*HttpServer).handleCreateAndSendTxWithRelayingBNBHeader,
	createAndSendTxWithRelayingBTCHeader: (*HttpServer).handleCreateAndSendTxWithRelayingBTCHeader,
	getRelayingBNBHeaderState:            (*HttpServer).handleGetRelayingBNBHeaderState,
	getRelayingBNBHeaderByBlockHeight:    (*HttpServer).handleGetRelayingBNBHeaderByBlockHeight,
	getBTCRelayingBestState:              (*HttpServer).handleGetBTCRelayingBestState,
	getBTCBlockByHash:                    (*HttpServer).handleGetBTCBlockByHash,
	getLatestBNBHeaderBlockHeight:        (*HttpServer).handleGetLatestBNBHeaderBlockHeight,

	// incognnito mode for sc
	getBurnProofForDepositToSC:                    (*HttpServer).handleGetBurnProofForDepositToSC,
	getBurnPBSCProofForDepositToSC:                (*HttpServer).handleGetBurnPBSCProofForDepositToSC,
	createAndSendBurningForDepositToSCRequest:     (*HttpServer).handleCreateAndSendBurningForDepositToSCRequest,
	createAndSendBurningForDepositToSCRequestV2:   (*HttpServer).handleCreateAndSendBurningForDepositToSCRequestV2,
	createAndSendBurningPBSCForDepositToSCRequest: (*HttpServer).handleCreateAndSendBurningPBSCForDepositToSCRequest,
	getBurnPLGProofForDepositToSC:                 (*HttpServer).handleGetBurnPLGProofForDepositToSC,
	createAndSendBurningPLGForDepositToSCRequest:  (*HttpServer).handleCreateAndSendBurningPLGForDepositToSCRequest,
	createAndSendBurningFTMForDepositToSCRequest:  (*HttpServer).handleCreateAndSendBurningFTMForDepositToSCRequest,
	getBurnFTMProofForDepositToSC:                 (*HttpServer).handleGetBurnFTMProofForDepositToSC,

	//feature stat
	getFeatureStats: (*HttpServer).hanldeGetFeatureStats,

	//new pool info
	getSyncStats:          (*HttpServer).hanldeGetSyncStats,
	getBeaconPoolInfo:     (*HttpServer).hanldeGetBeaconPoolInfo,
	getShardPoolInfo:      (*HttpServer).hanldeGetShardPoolInfo,
	getCrossShardPoolInfo: (*HttpServer).hanldeGetCrossShardPoolInfo,
	getAllView:            (*HttpServer).hanldeGetAllView,
	getAllViewDetail:      (*HttpServer).hanldeGetAllViewDetail,
	isInstantFinality:     (*HttpServer).hanldeIsInstantFinality,
	// feature reward
	getRewardFeature: (*HttpServer).handleGetRewardFeature,

	// get committeeByHeight

	getTotalStaker: (*HttpServer).handleGetTotalStaker,

	//validators state
	getValKeyState: (*HttpServer).handleGetValKeyState,

	// portal v4
	getPortalV4State:                           (*HttpServer).handleGetPortalV4State,
	createAndSendTxWithShieldingRequest:        (*HttpServer).handleCreateAndSendTxWithShieldingReq,
	getPortalShieldingRequestStatus:            (*HttpServer).handleGetPortalShieldingRequestStatus,
	createAndSendTxWithPortalV4UnshieldRequest: (*HttpServer).handleCreateAndSendTxWithPortalV4UnshieldRequest,
	getPortalUnshieldingRequestStatus:          (*HttpServer).handleGetPortalUnshieldingRequestStatus,
	getPortalBatchUnshieldingRequestStatus:     (*HttpServer).handleGetPortalBatchUnshieldingRequestStatus,
	getSignedRawTransactionByBatchID:           (*HttpServer).handleGetPortalSignedExtTxWithBatchID,
	createAndSendTxWithPortalReplacementFee:    (*HttpServer).handleCreateAndSendTxWithPortalReplaceUnshieldFee,
	getPortalReplacementFeeStatus:              (*HttpServer).handleGetPortalReplacementFeeRequestStatus,
	createAndSendTxWithPortalSubmitConfirmedTx: (*HttpServer).handleCreateAndSendTxWithPortalSubmitConfirmedTx,
	getPortalSubmitConfirmedTx:                 (*HttpServer).handleGetPortalPortalSubmitConfirmedTxStatus,
	getSignedRawReplaceFeeTransaction:          (*HttpServer).handleGetPortalTransactionSignedWithFeeReplacementTx,
	createAndSendTxPortalConvertVaultRequest:   (*HttpServer).handleCreateAndSendTxWithPortalConvertVault,
	getPortalConvertVaultTxStatus:              (*HttpServer).handleGetPortalConvertVaultTxStatus,
	getPortalV4Params:                          (*HttpServer).handleGetPortalV4Params,
	generatePortalShieldMultisigAddress:        (*HttpServer).handleGenerateShieldingMultisigAddress,

	// unstake
	unstake: (*HttpServer).handleCreateUnstakeTransaction,

	connectionStatus: (*HttpServer).handleGetConnectionStatus,

	// prune
	prune:          (*HttpServer).handlePrune,
	getPruneState:  (*HttpServer).getPruneState,
	checkPruneData: (*HttpServer).checkPruneData,
}

// Commands that are available to a limited user
var LimitedHttpHandler = map[string]httpHandler{
	// local WALLET
	listAccounts:                     (*HttpServer).handleListAccounts,
	getAccount:                       (*HttpServer).handleGetAccount,
	getAddressesByAccount:            (*HttpServer).handleGetAddressesByAccount,
	getAccountAddress:                (*HttpServer).handleGetAccountAddress,
	dumpPrivkey:                      (*HttpServer).handleDumpPrivkey,
	importAccount:                    (*HttpServer).handleImportAccount,
	removeAccount:                    (*HttpServer).handleRemoveAccount,
	listUnspentOutputCoins:           (*HttpServer).handleListUnspentOutputCoins,
	listUnspentOutputCoinsFromCache:  (*HttpServer).handleListUnspentOutputCoinsFromCache,
	getBalance:                       (*HttpServer).handleGetBalance,
	getBalanceByPrivatekey:           (*HttpServer).handleGetBalanceByPrivatekey,
	getBalanceByPaymentAddress:       (*HttpServer).handleGetBalanceByPaymentAddress,
	getReceivedByAccount:             (*HttpServer).handleGetReceivedByAccount,
	setTxFee:                         (*HttpServer).handleSetTxFee,
	convertNativeTokenToPrivacyToken: (*HttpServer).handleConvertNativeTokenToPrivacyToken,
	convertPrivacyTokenToNativeToken: (*HttpServer).handleConvertPrivacyTokenToNativeToken,
	submitKey:                        (*HttpServer).handleSubmitKey,
	authorizedSubmitKey:              (*HttpServer).handleAuthorizedSubmitKey,
	getKeySubmissionInfo:             (*HttpServer).handleGetKeySubmissionInfo,
}

var WsHandler = map[string]wsHandler{
	testSubcrice:                                (*WsServer).handleTestSubcribe,
	subcribeNewShardBlock:                       (*WsServer).handleSubscribeNewShardBlock,
	subcribeNewBeaconBlock:                      (*WsServer).handleSubscribeNewBeaconBlock,
	subcribePendingTransaction:                  (*WsServer).handleSubscribePendingTransaction,
	subcribeShardCandidateByPublickey:           (*WsServer).handleSubcribeShardCandidateByPublickey,
	subcribeShardCommitteeByPublickey:           (*WsServer).handleSubcribeShardCommitteeByPublickey,
	subcribeShardPendingValidatorByPublickey:    (*WsServer).handleSubcribeShardPendingValidatorByPublickey,
	subcribeBeaconCandidateByPublickey:          (*WsServer).handleSubcribeBeaconCandidateByPublickey,
	subcribeBeaconPendingValidatorByPublickey:   (*WsServer).handleSubcribeBeaconPendingValidatorByPublickey,
	subcribeBeaconCommitteeByPublickey:          (*WsServer).handleSubcribeBeaconCommitteeByPublickey,
	subcribeMempoolInfo:                         (*WsServer).handleSubcribeMempoolInfo,
	subcribeCrossOutputCoinByPrivateKey:         (*WsServer).handleSubcribeCrossOutputCoinByPrivateKey,
	subcribeCrossCustomTokenPrivacyByPrivateKey: (*WsServer).handleSubcribeCrossCustomTokenPrivacyByPrivateKey,
	subcribeShardBestState:                      (*WsServer).handleSubscribeShardBestState,
	subcribeBeaconBestState:                     (*WsServer).handleSubscribeBeaconBestState,
	subcribeBeaconBestStateFromMem:              (*WsServer).handleSubscribeBeaconBestStateFromMem,
	subcribeBeaconPoolBeststate:                 (*WsServer).handleSubscribeBeaconPoolBestState,
	subcribeShardPoolBeststate:                  (*WsServer).handleSubscribeShardPoolBeststate,
}
