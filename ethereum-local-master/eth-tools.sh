#!/bin/bash

# Get list of accounts
show_accounts() {
    docker exec ethereum-local geth attach --exec "eth.accounts" /root/.ethereum/geth.ipc
}

# Create new account
create_account() {
    docker exec ethereum-local geth account new --datadir=/root/.ethereum --password=/root/.ethereum/password.txt
}

# Check balance
check_balance() {
    if [ "$1" ]; then
        docker exec ethereum-local geth attach --exec "web3.fromWei(eth.getBalance('$1'), 'ether')" /root/.ethereum/geth.ipc
    else
        echo "Please provide an address: ./eth-tools.sh balance 0x..."
    fi
}

# Send ETH
send_eth() {
    if [ "$1" ] && [ "$2" ]; then
        # Unlock account
        docker exec ethereum-local geth attach --exec "personal.unlockAccount(eth.coinbase, '', 300)" /root/.ethereum/geth.ipc
        
        # Send ETH
        docker exec ethereum-local geth attach --exec "eth.sendTransaction({from: eth.coinbase, to: '$1', value: web3.toWei($2, 'ether')})" /root/.ethereum/geth.ipc
        
        echo "Sent $2 ETH to $1"
    else
        echo "Please provide recipient address and amount: ./eth-tools.sh send 0x... 1.5"
    fi
}

# Network information
network_info() {
    echo "Ethereum network information:"
    docker exec ethereum-local geth attach --exec "admin.nodeInfo" /root/.ethereum/geth.ipc
}

# Show current block
current_block() {
    docker exec ethereum-local geth attach --exec "eth.blockNumber" /root/.ethereum/geth.ipc
}

# Show help
show_help() {
    echo "Available commands:"
    echo "  ./eth-tools.sh accounts          - Show list of accounts"
    echo "  ./eth-tools.sh create            - Create new account"
    echo "  ./eth-tools.sh balance 0x...     - Check account balance"
    echo "  ./eth-tools.sh send 0x... 1.5    - Send 1.5 ETH to address"
    echo "  ./eth-tools.sh network           - Display network information"
    echo "  ./eth-tools.sh block             - Display current block"
    echo "  ./eth-tools.sh help              - Show this help"
}

# Process command
case "$1" in
    accounts)
        show_accounts
        ;;
    create)
        create_account
        ;;
    balance)
        check_balance "$2"
        ;;
    send)
        send_eth "$2" "$3"
        ;;
    network)
        network_info
        ;;
    block)
        current_block
        ;;
    help|*)
        show_help
        ;;
esac
