const axios = require("axios");
const { deployCollection } = require("../../scripts/deployCollection");
const Collection = require("../models/collections");
const Transaction = require("../models/transactions");

async function deployCollectionAndSave(req, res) {
  try {
    // Lấy thông tin từ request
    const { name, symbol, description, imageURL, blockchain } = req.body;
    const chainType = blockchain || "forma";
    const creator_id = req.user ? req.user.id : null;

    // Deploy hợp đồng lên chain
    const contractAddress = await deployCollection(name, symbol, description, imageURL, chainType);

    // Tạo Collection record
    const collectionRecord = await Collection.create({
      name,
      description,
      blockchain: chainType,
      contract_address: contractAddress,
      image_url: imageURL,
      creator_id,
    });

    // Tạo Transaction record cho giao dịch deploy (liên kết với Collection vừa tạo)
    await Transaction.create({
      transaction_hash: contractAddress,
      transaction_type: 'deployment',
      price: 0,
      status: 'success',
      collection_id: collectionRecord.id,
    });

    // Lấy thông tin địa chỉ người triển khai từ contract (creator)
    const creatorAddress = await collectionRecord.creator_id;  // Hoặc bạn có thể lấy trực tiếp từ `creator_id` trong `req.user.id`

    // Tạo URL để tra cứu trên blockchain explorer
    const explorerUrl = `https://explorer.sketchpad-1.forma.art/address/${contractAddress}`;

    // Trả về kết quả cùng với thông tin blockchain explorer
    res.json({
      success: true,
      contractAddress,
      collection: collectionRecord,
      creatorAddress,
      explorerUrl,  // Địa chỉ tra cứu trên Explorer
    });
  } catch (error) {
    console.error("Error in deployment process:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { deployCollectionAndSave };
