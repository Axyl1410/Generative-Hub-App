// controllers/nftController.js
const Nft = require("../models/nfts");

const createNft = async (req, res) => {
  try {
    const { token_id, name, description, image_url, metadata_url, owner_id, collection_id, traits } = req.body;

    const newNft = await Nft.create({
      token_id,
      name,
      description,
      image_url,
      metadata_url,
      owner_id,
      collection_id,
      traits
    });

    res.status(201).json({ nft: newNft });
  } catch (error) {
    res.status(500).json({ message: "Error creating NFT", error });
  }
};

module.exports = { createNft };
