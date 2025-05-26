const { ethers } = require('hardhat');
const fs = require('fs');

const NETWORK_CONFIG = {
  mainnet: {
    kyberNetworkProxy: '0x9AAb3f75489902f3a48495025729a0AF77d4b11e',
    uniswapRouterAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  },
  bsc: {
    kyberNetworkProxy: '0x878dFE971d44e9122048308301F540910Bbd934c',
    uniswapRouterAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap V2 Router
  },
  polygon: {
    kyberNetworkProxy: '0xC5e1DaeC2ad401eBEBdd3E32516d90Ab251A3aA3',
    uniswapRouterAddress: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  },
  localhost: {
    kyberNetworkProxy: '0x9AAb3f75489902f3a48495025729a0AF77d4b11e', // Sử dụng địa chỉ mainnet cho fork local
    uniswapRouterAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  },
};

async function main() {
  console.log('Starting deployment of Incognito Bridge contracts...');

  // Get deployer account from private key in .env
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  if (balance == 0n) {
    throw new Error(
      'Deployer account has no ETH. Please fund it before deployment.'
    );
  }

  // Deploy TradeUtils
  console.log('Deploying TradeUtils contract...');
  const TradeUtils = await ethers.getContractFactory('TradeUtils');
  const tradeUtils = await TradeUtils.deploy();
  // Wait for deployment to complete - ethers v6 syntax
  await tradeUtils.waitForDeployment();
  const tradeUtilsAddress = await tradeUtils.getAddress();
  console.log(`TradeUtils deployed to: ${tradeUtilsAddress}`);

  // Deploy Vault contract
  console.log('Deploying Vault contract...');
  const Vault = await ethers.getContractFactory('Vault');
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`Vault deployed to: ${vaultAddress}`);

  // Deploy IncognitoProxy contract with Vault address
  console.log('Deploying IncognitoProxy contract...');
  let committees;
  try {
    committees = JSON.parse(
      fs.readFileSync('committee-addresses.json', 'utf8')
    );
    console.log('Loaded committee addresses from file');
  } catch (error) {
    console.warn('Could not load committee addresses, using default ones');
    // Fallback nếu không đọc được file
    committees = {
      beaconCommittee: [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ],
      bridgeCommittee: [
        '0x4444444444444444444444444444444444444444',
        '0x5555555555555555555555555555555555555555',
        '0x6666666666666666666666666666666666666666',
      ],
    };
  }

  const beaconCommittee = [deployer.address, ...committees.beaconCommittee];
  const bridgeCommittee = [deployer.address, ...committees.bridgeCommittee];
  const IncognitoProxy = await ethers.getContractFactory('IncognitoProxy');
  const incognitoProxy = await IncognitoProxy.deploy(
    deployer.address,
    beaconCommittee,
    bridgeCommittee
  );
  await incognitoProxy.waitForDeployment();
  const incognitoProxyAddress = await incognitoProxy.getAddress();
  console.log(`IncognitoProxy deployed to: ${incognitoProxyAddress}`);

  // Deploy KBNTrade (if needed)
  console.log('Deploying KBNTrade contract...');
  const KBNTrade = await ethers.getContractFactory('KBNTrade');
  const kbnTrade = await KBNTrade.deploy(
    NETWORK_CONFIG.localhost.kyberNetworkProxy
  );
  await kbnTrade.waitForDeployment();
  const kbnTradeAddress = await kbnTrade.getAddress();
  console.log(`KBNTrade deployed to: ${kbnTradeAddress}`);

  // Deploy UniswapTrade (if needed)
  // 1. Deploy Mock Uniswap Router
  console.log('Deploying MockUniswapV2Router...');
  const MockUniswapV2Router = await ethers.getContractFactory(
    'MockUniswapV2Router'
  );
  const mockRouter = await MockUniswapV2Router.deploy();
  await mockRouter.waitForDeployment();
  const routerAddress = await mockRouter.getAddress();
  console.log(`MockUniswapV2Router deployed to: ${routerAddress}`);

  console.log('Deploying UniswapTrade contract...');
  const UniswapTrade = await ethers.getContractFactory('UniswapV2Trade');
  const uniswapTrade = await UniswapTrade.deploy(routerAddress);
  await uniswapTrade.waitForDeployment();
  const uniswapTradeAddress = await uniswapTrade.getAddress();
  console.log(`UniswapTrade deployed to: ${uniswapTradeAddress}`);

  // Save deployment information to a file
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      tradeUtils: tradeUtilsAddress,
      vault: vaultAddress,
      incognitoProxy: incognitoProxyAddress,
      kbnTrade: kbnTradeAddress,
      uniswapTrade: uniswapTradeAddress,
    },
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('\n=== Deployment Summary ===');
  console.log(`Deployer: ${deployer.address}`);
  console.log(`TradeUtils: ${tradeUtilsAddress}`);
  console.log(`Vault: ${vaultAddress}`);
  console.log(`IncognitoProxy: ${incognitoProxyAddress}`);
  console.log(`KBNTrade: ${kbnTradeAddress}`);
  console.log(`UniswapTrade: ${uniswapTradeAddress}`);
  console.log('===========================\n');
  console.log('Deployment information saved to deployment-info.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
