const User = require("../models/User")
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    jwt.verify(
        req.headers.authorization ? req.headers.authorization.substring(7) : "",
        process.env.JWT_SECRET,
        (err, token) => {
            if (err) {
                return res.status(401).json({
                    messageBag: [{ msg: "Invalid JWT token." }]
                })
            } else {
                User.findOne({ email: token.email }).then((user) => {
                    if (user) {
                        req.params.token = token
                        next()
                    } else {
                        return res.status(401).json({
                            messageBag: [{ msg: "User no longer exists." }]
                        })
                    }
                })
            }
        }
    )
}
