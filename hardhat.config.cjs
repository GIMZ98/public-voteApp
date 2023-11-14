require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat:{
      chainId: 1337,
    },
    sepolia:{
      url: process.env.VITE_BASE_API_URI,
      accounts: [process.env.VITE_BASE_PRIVATE_KEY]
    },
  }
};
