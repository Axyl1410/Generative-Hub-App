const express = require("express");
const router = express.Router();
const { walletLogin, createUser, upload, getUserByWalletAddress, updateUser, searchUser } = require("../controllers/userController");

//login with wallet
router.post("/wallet-login", walletLogin);
router.get("/get-user/:wallet_address", getUserByWalletAddress);
router.put('/update-user', upload, updateUser);
router.get("/search-user/:query", searchUser);

module.exports = router;
