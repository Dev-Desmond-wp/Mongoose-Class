const jwt = require('jsonwebtoken')
const userModel = ('../models/user.js')

exports.authenticate = async (req, res, next) => {
    try {
        console.log('Request Objects' , req.headers.authorization)
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({
                message: "Auth not found"
            })
        }
        const token = auth.split(' ')[1]

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decodedToken)
        const user = await userModel.findById(decodedToken.id)
        if (!user) {
            return res.status(401).json({
                message: 'Auth Failed: User not found'
            })
        }

        req.user = decodedToken
        next()

    } catch (error) {
        if(error instanceof jwt.TokenExoiredErorr || error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Session Expierd: please login to continue'
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}