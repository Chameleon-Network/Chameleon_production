const { ethers } = require('ethers');
const fs = require('fs');

// Tạo ví ngẫu nhiên
function generateWallets(count) {
  const wallets = [];
  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }
  return wallets;
}

// Tạo 4 địa chỉ cho mỗi committee
const beaconWallets = generateWallets(4);
const bridgeWallets = generateWallets(4);

// Chuẩn bị dữ liệu
const committeeData = {
  beaconCommittee: beaconWallets.map((w) => w.address),
  bridgeCommittee: bridgeWallets.map((w) => w.address),
  // Lưu private keys cho việc debug nếu cần
  wallets: {
    beacon: beaconWallets,
    bridge: bridgeWallets,
  },
};

// Lưu vào file
fs.writeFileSync(
  'committee-addresses.json',
  JSON.stringify(committeeData, null, 2)
);

console.log(
  'Committee addresses generated and saved to committee-addresses.json'
);
console.log('Beacon Committee:', committeeData.beaconCommittee);
console.log('Bridge Committee:', committeeData.bridgeCommittee);
