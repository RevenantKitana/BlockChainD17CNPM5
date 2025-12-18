const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Đang deploy MessageBoard contract...");

  // Deploy contract
  const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
  const messageBoard = await MessageBoard.deploy();

  await messageBoard.waitForDeployment();

  const contractAddress = await messageBoard.getAddress();
  console.log(`MessageBoard deployed to: ${contractAddress}`);

  // Lưu địa chỉ contract vào file config cho frontend
  const config = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployTime: new Date().toISOString()
  };

  const configPath = path.join(__dirname, "../frontend/config.js");
  const configContent = `const CONTRACT_ADDRESS = "${contractAddress}";\nconst NETWORK = "${hre.network.name}";\n`;
  
  fs.writeFileSync(configPath, configContent);
  console.log(`Đã lưu địa chỉ contract vào ${configPath}`);

  // Lưu ABI vào frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/MessageBoard.sol/MessageBoard.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const abiPath = path.join(__dirname, "../frontend/MessageBoard.json");
  fs.writeFileSync(abiPath, JSON.stringify(artifact, null, 2));
  console.log(`Đã lưu ABI vào ${abiPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
