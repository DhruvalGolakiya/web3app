import { ethers } from "hardhat";

async function main() {
  const Transfer = await ethers.getContractFactory("Lottery");
  const transfer = await Transfer.deploy(10);

  await transfer.deployed();

  console.log(`Contract Deployed at deployed to ${transfer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
