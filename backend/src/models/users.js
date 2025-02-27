// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true,
  },
  wallet_address: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
  cover_url: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
}, {
  tableName: "users",  
  timestamps: true,
});

module.exports = User;


module.exports = User;
