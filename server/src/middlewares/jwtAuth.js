const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, token) => {
        if (err) {
            return res.status(401).json({
                error: err,
            })
        } else {
            req.params.token = token
            next()
        }
    })
}
