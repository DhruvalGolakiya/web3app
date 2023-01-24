import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      gas: 80000,
      chainId: 1337,
    },
  },
  solidity: "0.8.17",
};

export default config;
