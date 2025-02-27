const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");
const Nft = require("./nfts");
const User = require("./users");
const Collection = require("./collections");

const Transaction = sequelize.define("Transactions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  transaction_hash: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  transaction_type: {
    type: DataTypes.ENUM("deployment", "nft_transfer"),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("pending", "success", "failed"),
    allowNull: false,
    defaultValue: "pending",
  },
}, {
  tableName: "transactions",
  timestamps: true,
});

// Quan hệ với Collection (nếu giao dịch liên quan đến Collection)
Transaction.belongsTo(Collection, { foreignKey: "collection_id" });

// Quan hệ với NFT (nếu giao dịch liên quan đến NFT)
Transaction.belongsTo(Nft, { foreignKey: "nft_id" });

// Quan hệ với Users (nếu có người mua và người bán)
Transaction.belongsTo(User, { foreignKey: "buyer_id" });
Transaction.belongsTo(User, { foreignKey: "seller_id" });

module.exports = Transaction;
