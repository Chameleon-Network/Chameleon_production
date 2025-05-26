# Ethereum Bridge Deployment

This project deploys the Incognito bridge contracts to a local Ethereum network.

## Prerequisites

- Node.js (v20+)
- Yarn
- Local Ethereum node running (from ethereum-local)

## Setup

1. Install dependencies:

yarn

2. Extract private key from the local node (optional):
./extract-key.sh


3. Deploy contracts to local network:
./deploy-bridge.sh

markdown

## Contract Structure

The main contracts are:
- Vault: Holds the funds locked in the bridge
- IncognitoProxy: Handles cross-chain communication
- TradeUtils: Utility functions for trading
- KBNTrade: KyberNetwork trading functionality
- UniswapTrade: Uniswap trading functionality

## Available Scripts

- `extract-key.sh`: Extracts private key from local node
- `deploy-bridge.sh`: Deploys contracts to local network
- `cleanup.sh`: Cleans up generated files
