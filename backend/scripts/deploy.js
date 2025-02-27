
// const { ethers } = require("hardhat");
// const fs = require("fs");
// const path = require("path");


// async function main() {
//     const [deployer] = await ethers.getSigners();

//     console.log("Deploying contracts with the account:", deployer.address);

//     const Token = await ethers.getContractFactory("Token");
//     const token = await Token.deploy(); // Triển khai mà không cần tham số

//     await token.waitForDeployment(); // Đợi transaction hoàn thành
//     const tokenAddress = await token.getAddress(); // Lấy địa chỉ hợp đồng

//     console.log("Token contract deployed to:", tokenAddress); // In ra địa chỉ hợp đồng
//     // Lưu địa chỉ & ABI vào file JSON
//     const contractData = {
//         address: tokenAddress,
//         abi: JSON.parse(token.interface.formatJson())
//     };

//     fs.writeFileSync(path.join(__dirname, "../deployedContract.json"), JSON.stringify(contractData, null, 2));

//     console.log("✅ Đã lưu địa chỉ & ABI vào `deployedContract.json`");
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });
