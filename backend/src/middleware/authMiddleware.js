// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(403).json({ error: 'Token is required for authentication' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        // Check if the user exists
        const foundUser = await User.findOne({ where: { id: user.id } });
        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = foundUser;
        next();
    });
};

module.exports = authenticateToken;
