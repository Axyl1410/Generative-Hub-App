// const { ethers } = require("hardhat");


// async function deployCollection(name, symbol, description, imageURL, blockchainType) {
//   const [deployer] = await ethers.getSigners();

//   console.log("Deploying contracts with the account:", deployer.address);

//   // Lấy Factory của Collection Contract
//   const Collection = await ethers.getContractFactory("Collection");

//   // Triển khai Contract với đúng thứ tự tham số:
//   // (name, symbol, description, imageURL, blockchainType)
//   const collection = await Collection.deploy(name, symbol, description, imageURL, blockchainType);

//   // Đợi cho đến khi việc deploy hoàn tất
//   await collection.waitForDeployment();
//   const contractAddress = collection.getAddress(); // Lấy địa chỉ hợp đồng

//   console.log("Collection contract deployed to:", contractAddress);

// //   // Nếu cần lưu địa chỉ & ABI vào file JSON, bạn có thể làm như sau:
// //   const contractData = {
// //     address: contractAddress,
// //     abi: Collection.interface.format(ethers.utils.FormatTypes.json)
// //   };

// //   // Lưu file vào thư mục hiện tại (có thể thay đổi đường dẫn tùy ý)
// //   fs.writeFileSync(
// //     path.join(__dirname, "../deployedCollectionContract.json"),
// //     JSON.stringify(contractData, null, 2)
// //   );

// return contractAddress;
// //   console.log("Đã lưu địa chỉ & ABI vào `deployedCollectionContract.json`");
// }
// async function main() {
//     console.log("Starting deployment...");

//     const contractAddress =await deployCollection("Test Collection", "TST", "A test collection", "https://example.com/image.png", "forma");
    
//     console.log("Deployment completed." + contractAddress);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });
// module.exports = { deployCollection };
