// controllers/collectionController.js
const Collection = require("../models/collections");

const createCollection = async (req, res) => {
  try {
    const { name, description, blockchain, contract_address} = req.body;

    const newCollection = await Collection.create({
      name,
      description,
      blockchain,
      contract_address,
      creator_id:req.user.id
    });

    res.status(201).json({ collection: newCollection });
  } catch (error) {
    res.status(500).json({ message: "Error creating collection", error });
  }
};

module.exports = { createCollection };
