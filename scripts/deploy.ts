import { ethers } from "hardhat";

async function main() {
  // Get the deployer's account from Hardhat
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  // Get the contract factory for MyNFT
  const MyNFT = await ethers.getContractFactory("MyNFT");

  // Deploy the contract and pass the deployer's address as the initial owner
  const myNFT = await MyNFT.deploy(deployer.address);

  // Wait until the contract is deployed (using ethers v6 method)
  await myNFT.waitForDeployment();
  console.log("Contract deployed to:", await myNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
