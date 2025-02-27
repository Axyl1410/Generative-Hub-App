const express = require("express");
const {  deployCollectionAndSave } = require("../controllers/deployContract");
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post("/deploy",authenticateToken,  deployCollectionAndSave);

module.exports = router;
