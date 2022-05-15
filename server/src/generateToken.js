const jwt = require("jsonwebtoken")

exports.generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        }
    )
}
