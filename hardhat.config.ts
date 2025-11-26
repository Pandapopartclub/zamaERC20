import "@fhevm/hardhat-plugin";
import "hardhat-deploy";
import "dotenv/config";

import "./tasks/FHECounter";
import "./tasks/MyConfidentialToken";

const config = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  mocha: {
    timeout: 500000,
  },
};

export default config;
