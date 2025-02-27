// routes/collectionRoutes.js
const express = require("express");
const authenticateToken = require('../middleware/authMiddleware');

const { createCollection } = require("../controllers/collectionController");

const router = express.Router();

router.post("/create", authenticateToken,createCollection);

module.exports = router;
