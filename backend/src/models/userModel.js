const db = require("../../config/mysql");

// Tìm user theo wallet
async function findUserByWallet(wallet_address) {
    try {
        const [users] = await db.promise().query("SELECT * FROM users WHERE wallet_address = ?", [wallet_address]);
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error("Error finding user by wallet:", error); // Log the actual error
        throw new Error("Database error while finding user.");
    }
}

// Thêm user mới
async function createUser(wallet_address) {
    try {
        await db.promise().query("INSERT INTO users (wallet_address) VALUES (?)", [wallet_address]);
        return findUserByWallet(wallet_address);
    } catch (error) {
        console.error("Error creating user:", error); // Log the actual error
        throw new Error("Database error while creating user.");
    }
}

module.exports = { findUserByWallet, createUser };
