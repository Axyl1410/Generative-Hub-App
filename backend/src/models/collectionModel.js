const db = require("../config/mysql");

// Tạo Collection mới
async function createCollection(name, description, owner) {
    const [result] = await db.execute(
        "INSERT INTO collections (name, description, owner) VALUES (?, ?, ?)",
        [name, description, owner]
    );
    return result.insertId;
}

// Lấy danh sách collections
async function getCollections() {
    const [collections] = await db.execute("SELECT * FROM collections");
    return collections;
}

module.exports = { createCollection, getCollections };
