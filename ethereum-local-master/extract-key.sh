#!/bin/bash

# Check if directory exists
if [ ! -d "../ethereum-local/data/keystore" ]; then
  echo "Keystore directory not found. Make sure your local node is running."
  exit 1
fi

# Find the keystore file
KEYSTORE_FILE=$(ls -1 ../ethereum-local/data/keystore/ | head -1)
if [ -z "$KEYSTORE_FILE" ]; then
  echo "No keystore file found. Make sure you have created an account."
  exit 1
fi

KEYSTORE_PATH="../ethereum-local/data/keystore/$KEYSTORE_FILE"
echo "Found keystore file: $KEYSTORE_PATH"

# Get account address from the file name
ACCOUNT=$(echo $KEYSTORE_FILE | grep -o '[a-fA-F0-9]\{40\}')
ACCOUNT="0x$ACCOUNT"
echo "Account: $ACCOUNT"

# Since this is a development environment with empty password
# we can use a tool like ethereumjs-wallet to extract the private key
echo "Installing ethereumjs-wallet to extract the private key..."
yarn add ethereumjs-wallet --no-save

# Create a temporary JavaScript file to extract the key
cat > extract.js << INNEREOF
const fs = require('fs');
const wallet = require('ethereumjs-wallet').default;

const keystore = fs.readFileSync('$KEYSTORE_PATH', 'utf8');
wallet
  .fromV3(keystore, '', true)
  .then((pWallet) => {
    const privateKey = pWallet.getPrivateKeyString();
    console.log('Private Key:', privateKey);
  })
  .catch((err) => {
    console.error('Error:', err);
  })
  .finally(() => {
    console.log('Done');
  });
INNEREOF

# Run the script
node extract.js

# Clean up
rm extract.js
