const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT Contract", function () {
  it("Should deploy and set the correct owner", async function () {
    const [deployer] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy(deployer.address);
    await myNFT.waitForDeployment();

    // For example, if you had a function to get the owner, you could check:
    // expect(await myNFT.owner()).to.equal(deployer.address);
  });
});
