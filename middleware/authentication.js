const jwt = require('jsonwebtoken');
const userModel = require('../models/user.js');

exports.authenticate = async (req, res, next) => {
    try {
        console.log('Request Objects', req.headers.authorization);
        const auth = req.headers.authorization;

        if (!auth) {
            return res.status(401).json({
                message: 'Auth not found'
            });
        }

        const token = auth.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Token not found'
            });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({
                message: 'Auth Failed: User not found'
            });
        }

        req.user = decodedToken;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid or expired token'
            });
        }
        return res.status(500).json({
            message: error.message
        });
    }
};
