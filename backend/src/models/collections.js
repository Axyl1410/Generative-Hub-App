// models/Collection.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");
const User = require("./users");

const Collection = sequelize.define("Collections", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  blockchain: {
    type: DataTypes.ENUM('forma', 'ethereum', 'polygon', 'astria'),
    allowNull: false,
  },
  contract_address: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
}, {
  tableName: "collections",  
  timestamps: true,
});

Collection.belongsTo(User, { foreignKey: "creator_id" });

module.exports = Collection;
