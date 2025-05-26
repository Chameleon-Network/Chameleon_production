#!/bin/bash

# Check if node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js and try again."
    exit 1
fi

# Check if web3 package is installed
if ! node -e "require('web3')" &> /dev/null; then
    echo "Installing web3 package..."
    yarn add web3
fi

# Function to display help
function show_help {
    echo "Ethereum Local Faucet"
    echo ""
    echo "Usage: ./faucet.sh [OPTIONS] <ethereum_address>"
    echo ""
    echo "Options:"
    echo "  -h, --help     Display this help message"
    echo "  -a, --amount   Amount of ETH to send (default: 1.0)"
    echo ""
    echo "Example:"
    echo "  ./faucet.sh 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    echo "  ./faucet.sh --amount 5 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
}

# Default ETH amount
AMOUNT="1.0"

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -a|--amount)
            AMOUNT="$2"
            shift
            shift
            ;;
        *)
            ADDRESS="$1"
            shift
            ;;
    esac
done

# Check if an address was provided
if [ -z "$ADDRESS" ]; then
    echo "Error: Ethereum address is required"
    show_help
    exit 1
fi

# Update the ETH amount in the faucet script
cat > faucet.js << JSEOF
const { Web3 } = require('web3');

// Connect to local Ethereum node
const web3 = new Web3('http://localhost:8545');

// Amount to send (in ETH)
const ETH_AMOUNT = '${AMOUNT}';
const WEI_AMOUNT = web3.utils.toWei(ETH_AMOUNT, 'ether');

async function sendEth(toAddress) {
  try {
    // Validate the address
    if (!web3.utils.isAddress(toAddress)) {
      console.error('Invalid Ethereum address');
      process.exit(1);
    }

    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const funderAccount = accounts[0];
    console.log('Funder account:', funderAccount);

    // Check the balance of the funder account
    const balance = await web3.eth.getBalance(funderAccount);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    console.log(\`Funder balance: \${balanceEth} ETH\`);

    if (parseFloat(balanceEth) < parseFloat(ETH_AMOUNT)) {
      console.error('Insufficient funds in the funder account');
      process.exit(1);
    }

    console.log(\`Sending \${ETH_AMOUNT} ETH to \${toAddress}...\`);

    // Send transaction
    const receipt = await web3.eth.sendTransaction({
      from: funderAccount,
      to: toAddress,
      value: WEI_AMOUNT,
      gas: 21000
    });

    console.log(\`Successfully sent \${ETH_AMOUNT} ETH to \${toAddress}\`);
    console.log(\`Transaction hash: \${receipt.transactionHash}\`);
    
    // Get new balance of the recipient
    const newBalance = await web3.eth.getBalance(toAddress);
    const newBalanceEth = web3.utils.fromWei(newBalance, 'ether');
    console.log(\`Recipient balance: \${newBalanceEth} ETH\`);

  } catch (error) {
    console.error('Error sending ETH:', error.message);
    process.exit(1);
  }
}

sendEth('${ADDRESS}');
JSEOF

# Run the faucet script
node faucet.js

# Clean up
rm faucet.js
