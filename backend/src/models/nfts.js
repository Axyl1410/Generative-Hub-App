// models/Nft.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");
const User = require("./users");
const Collection = require("./collections");

const Nft = sequelize.define("Nfts", {
  token_id: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  metadata_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mint_status: {
    type: DataTypes.ENUM('pending', 'minted', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  transaction_hash: {
    type: DataTypes.STRING(100),
    defaultValue: null,
  },
  traits: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
}, {
  tableName: "nfts",  
  timestamps: true,
});

Nft.belongsTo(User, { foreignKey: "owner_id" });
Nft.belongsTo(Collection, { foreignKey: "collection_id" });

module.exports = Nft;
