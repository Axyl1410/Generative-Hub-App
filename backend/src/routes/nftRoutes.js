// routes/nftRoutes.js
const express = require("express");
const { createNft } = require("../controllers/nftController");

const router = express.Router();

router.post("/create", createNft);

module.exports = router;

