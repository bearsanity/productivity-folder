const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        var token = req.headers.authorization
        if (token === undefined) {
            return res.status(401).json("please enter token")
        }
        token = token.split(' ')[1]
        /// verify token
        if (!token) {
            return res.status(401).json("token not found")
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verifyToken
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
};
