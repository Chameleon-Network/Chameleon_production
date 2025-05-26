#!/bin/bash

# Create data directory if it doesn't exist
mkdir -p data

# Check if already initialized
if [ ! -d "data/geth" ]; then
    echo "Initializing Ethereum blockchain..."
    
    # Create empty password file
    touch data/password.txt
    
    # Initialize blockchain with genesis block
    docker run --rm -v $(pwd)/data:/root/.ethereum -v $(pwd)/genesis.json:/root/genesis.json ethereum/client-go:v1.11.6 init --datadir=/root/.ethereum /root/genesis.json
    
    echo "Initialization complete!"
    
    # Create account (no password needed)
    echo "Creating new account..."
    ACCOUNT=$(docker run --rm -v $(pwd)/data:/root/.ethereum ethereum/client-go:v1.11.6 account new --datadir=/root/.ethereum --password=/root/.ethereum/password.txt | grep -o '0x[0-9a-fA-F]\+')
    echo "Created account: $ACCOUNT"
    
    # Update genesis alloc with the new account
    echo "Updating genesis.json with new account..."
    cat genesis.json | sed "s/0x90fa2dc0290d95f3112c448b6485f2591741700/$ACCOUNT/g" > genesis_updated.json
    mv genesis_updated.json genesis.json
    
    # Reinitialize with updated genesis
    echo "Reinitializing with updated genesis..."
    docker run --rm -v $(pwd)/data:/root/.ethereum -v $(pwd)/genesis.json:/root/genesis.json ethereum/client-go:v1.11.6 init --datadir=/root/.ethereum /root/genesis.json
    
else
    # Get the first account from the keystore
    KEYSTORE_FILES=$(ls data/keystore/)
    if [ -z "$KEYSTORE_FILES" ]; then
        echo "No accounts found. Creating new account..."
        ACCOUNT=$(docker run --rm -v $(pwd)/data:/root/.ethereum ethereum/client-go:v1.11.6 account new --datadir=/root/.ethereum --password=/root/.ethereum/password.txt | grep -o '0x[0-9a-fA-F]\+')
        echo "Created account: $ACCOUNT"
    else
        # Extract account address from the keystore filename
        KEYSTORE_FILE=$(ls data/keystore/ | head -1)
        ACCOUNT=$(echo $KEYSTORE_FILE | grep -o '[0-9a-fA-F]\{40\}')
        ACCOUNT="0x$ACCOUNT"
        echo "Using existing account: $ACCOUNT"
    fi
fi

# Create a docker-compose file with the correct account
cat > docker-compose.yml << INNEREOF
version: '3.8'

services:
  ethereum-node:
    image: ethereum/client-go:v1.11.6
    container_name: ethereum-local
    command:
      - --datadir=/root/.ethereum
      - --http
      - --http.addr=0.0.0.0
      - --http.port=8545
      - --http.corsdomain=*
      - --http.api=eth,net,web3,personal,miner,admin,debug,txpool
      - --ws
      - --ws.addr=0.0.0.0
      - --ws.port=8546
      - --ws.origins=*
      - --ws.api=eth,net,web3,personal,miner,admin,debug,txpool
      - --networkid=1337
      - --mine
      - --miner.threads=1
      - --miner.gasprice=0
      - --miner.etherbase=$ACCOUNT
      - --unlock=$ACCOUNT
      - --password=/root/.ethereum/password.txt
      - --allow-insecure-unlock
      - --rpc.allow-unprotected-txs
      - --nodiscover
      - --maxpeers=0
    ports:
      - "8545:8545"
      - "8546:8546"
      - "30303:30303"
    volumes:
      - ./data:/root/.ethereum
      - ./genesis.json:/root/genesis.json
    healthcheck:
      test: ["CMD", "geth", "attach", "--exec", "eth.blockNumber", "/root/.ethereum/geth.ipc"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped

  block-explorer:
    image: alethio/ethereum-lite-explorer
    container_name: ethereum-explorer
    ports:
      - "8080:80"
    environment:
      - APP_NODE_URL=http://localhost:8545
    restart: unless-stopped
INNEREOF

# Start containers
echo "Starting Ethereum local chain..."
docker-compose up -d

echo "Waiting for Ethereum node to start..."
sleep 10

# Display information
ADDRESS=$(docker exec ethereum-local geth attach --exec "eth.coinbase" /root/.ethereum/geth.ipc 2>/dev/null || echo "N/A")
BLOCK=$(docker exec ethereum-local geth attach --exec "eth.blockNumber" /root/.ethereum/geth.ipc 2>/dev/null || echo "N/A")

echo ""
echo "Ethereum local chain started successfully!"
echo "----------------------------------------------------------------"
echo "JSON-RPC: http://localhost:8545"
echo "WebSocket: ws://localhost:8546"
echo "Block Explorer: http://localhost:8080"
echo "Main account: $ACCOUNT"
echo "Current block: $BLOCK"
echo "----------------------------------------------------------------"
echo "To stop the chain: docker-compose down"
echo "To view logs: docker-compose logs -f"
