const { ethers } = require('hardhat');

async function main() {
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

  // Deploy TestToken
  console.log('Deploying TestToken contract...');

  // Tham số có thể điều chỉnh
  const tokenName = 'Test Token';
  const tokenSymbol = 'TEST';
  const initialSupply = 1000000; // 1 million tokens

  const TestToken = await ethers.getContractFactory('TestToken');
  const testToken = await TestToken.deploy(
    tokenName,
    tokenSymbol,
    initialSupply
  );
  await testToken.waitForDeployment();
  const testTokenAddress = await testToken.getAddress();
  console.log(`TestToken deployed to: ${testTokenAddress}`);
  console.log(`Token Name: ${await testToken.name()}`);
  console.log(`Token Symbol: ${await testToken.symbol()}`);
  console.log(
    `Total Supply: ${ethers.formatEther(await testToken.totalSupply())}`
  );
  console.log(
    `Deployer Balance: ${ethers.formatEther(
      await testToken.balanceOf(deployer.address)
    )}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed:');
    console.error(error);
    process.exit(1);
  });
