require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  
  solidity: "0.8.28",
  networks: {
    forma: {
      url: process.env.FORMA_CHAIN_URL, // Kết nối Forma
      accounts: [process.env.PRIVATE_KEY], // Private key
      chainId: 984123, // Chain ID
    },
  },
};
