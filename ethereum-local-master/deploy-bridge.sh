#!/bin/bash

echo "🚀 Starting Incognito Bridge deployment process with private key from .env..."

# Check if private key exists in .env
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found. Creating template .env file."
  echo "LOCAL_NODE_URL=http://localhost:8545" > .env
  echo "PRIVATE_KEY=0xa4fec016a8b276393977334f07db335b76d4c3d4e672768964793182260d5701" >> .env
  echo "⚠️ Please edit .env file and add your private key, then run this script again."
  exit 1
fi

# Check if private key exists in .env
PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2)
if [[ -z "$PRIVATE_KEY" ]]; then
  echo "❌ Error: Private key not set in .env file."
  echo "⚠️ Please edit .env file and add your private key, then run this script again."
  exit 1
fi

# Check connection to local Ethereum node
echo "🔍 Checking connection to Ethereum node..."
NODE_URL=$(grep LOCAL_NODE_URL .env | cut -d '=' -f2)
NODE_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' $NODE_URL)

echo "Node response: $NODE_RESPONSE"
if [[ $NODE_RESPONSE != *"result"* ]]; then
  echo "❌ Error: Cannot connect to Ethereum node at $NODE_URL"
  echo "   Make sure your node is running before continuing."
  
  # Additional troubleshooting
  echo -e "\n📋 Troubleshooting:"
  echo "1. Check if your Ethereum node is running:"
  echo "   docker ps | grep ethereum"
  echo "2. Try accessing the node with netcat:"
  echo "   nc -zv localhost 8545"
  echo "3. Check your node's logs:"
  echo "   docker logs <container_name>"
  echo "4. Make sure your node's RPC interface is enabled and listening on the correct address."
  exit 1
fi

echo "✅ Successfully connected to Ethereum node"

# Create file to check address and balance from private key
cat > check-address.js << JSEOF
const { ethers } = require("hardhat");

async function main() {
  // Get account from private key
  const [account] = await ethers.getSigners();
  console.log("Deployer address:", account.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(account.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  // Display warning if balance is low
  if (balance < ethers.parseEther('0.1')) {
    console.log("⚠️ Warning: Low balance. You may not have enough ETH for deployment.");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
JSEOF

# Check account information
echo "👤 Checking account from private key..."
npx hardhat run check-address.js

# # clean up
rm check-address.js

# Compile smart contracts
echo "🔨 Compiling smart contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
  echo "❌ Compilation failed. Please check the contract code for errors."
  exit 1
fi

# Deploy contracts
echo "🚀 Deploying contracts to Ethereum network..."
npx hardhat run --network localhost scripts/deploy.js

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed."
  exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📝 Check deployment-info.json for contract addresses and details"
