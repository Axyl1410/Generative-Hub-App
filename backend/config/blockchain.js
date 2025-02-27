const Web3 = require("web3");
const contractABI = require("./contractABI.json");  // ABI của contract ERC-721
const CONTRACT_ADDRESS = "0xYourSmartContractAddress";

// Kết nối Web3
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.forma.network"));

// Tạo instance contract
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

module.exports = { web3, contract };
