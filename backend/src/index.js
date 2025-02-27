require('events').EventEmitter.defaultMaxListeners = 50;
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// const authenticateToken = require('./utils/authenticate');
const usersRoutes = require('./routes/usersRoutes'); // Import user.js
const collectionRoutes = require("./routes/collectionRoutes");
const nftRoutes = require("./routes/nftRoutes");
const contractRoutes = require("./routes/contractRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(bodyParser.json());
app.use(cors());
console.log(usersRoutes);  // Log middleware
console.log(collectionRoutes); // Log middleware
console.log(nftRoutes); // Log middleware
// routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', usersRoutes); // Use user.js
app.use("/api/collections", collectionRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/contracts", contractRoutes);

// Default 404 handler
app.use((req, res, next) => {
    console.log("404 - Request URL:", req.method, req.url);
    res.status(404).json({
        error: 'NOT FOUND K',
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: 'Internal server error',
        message: err.message,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
