const bcrypt = require("bcryptjs")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const WishlistItem = require("../models/WishlistItem")
const Rating = require("../models/Rating")
const { generateToken } = require("../generateToken")

exports.get = (req, res, next) => {
    User.findOne({ email: req.params.token.email }, (err, model) => {
        return res.status(200).json({
            email: model.email,
            first_name: model.first_name,
            last_name: model.last_name
        })
    })
}

exports.store = (req, res, next) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({
                messageBag: [{ msg: "User with this email already exists." }]
            })
        }
        return bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
            let userModel = new User({
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: hashedPassword,
                last_login: null
            })
            userModel.save((error) => {
                return res.send({
                    messageBag: [{ msg: "Account has been created, please move to the login page now." }],
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User"
                })
            })
        })
    })
}

exports.update = (req, res, next) => {
    User.findOne({ email: req.params.token.email }, (err, user) => {
        if (!user) {
            return res.status(400).json({
                messageBag: [{ msg: "User not found." }]
            })
        }
        User.findOne({ email: req.body.email }, (err, sameEmailUser) => {
            if (req.params.token.email !== req.body.email && sameEmailUser) {
                return res.status(400).json({
                    flashMessageBag: [{ msg: "User with this email already exists." }]
                })
            }
            user.email = req.body.email
            user.first_name = req.body.first_name
            user.last_name = req.body.last_name
            user.save((error) => {
                let token = generateToken(user)
                return res.status(200).send({
                    flashMessageBag: [{ msg: "Account has been updated." }],
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    token: token
                })
            })
        })
    })
}

exports.destroy = (req, res, next) => {
    let promises = []

    User.findOne({ email: req.params.token.email }, (err, user) => {
        promises.push(WishlistItem.deleteMany({ user: { id: user.id } }))
        promises.push(Rating.deleteMany({ user_id: user.id }))

        Promise.all(promises).then(() => {
            user.remove().then(() => {
                return res.status(200).json({
                    flashMessageBag: [{ msg: "Account has been deleted." }]
                })
            })
        })
    })
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(400).json({
                messageBag: [{ msg: "Email address and/or password is invalid." }]
            })
        }
        return bcrypt.compare(req.body.password, user.password).then((isPasswordValid) => {
            if (isPasswordValid) {
                const token = generateToken(user)
                const lastLogin = user.last_login
                user.last_login = new Date()
                user.save(() => {
                    return res.status(200).json({
                        flashMessageBag: [{ msg: "Logged in." }],
                        token,
                        last_login: lastLogin
                    })
                })
            } else {
                return res.status(400).json({
                    messageBag: [{ msg: "Email address and/or password is invalid." }]
                })
            }
        })
    })
}

exports.updatePassword = (req, res, next) => {
    User.findOne({ email: req.params.token.email }, (err, user) => {
        if (!user) {
            return res.status(400).json({
                messageBag: [{ msg: "User not found." }]
            })
        }

        return bcrypt.compare(req.body.old_password, user.password).then((isPasswordValid) => {
            if (isPasswordValid) {
                bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
                    user.password = hashedPassword

                    user.save(() => {
                        return res.send({
                            flashMessageBag: [{ msg: "Password has been updated." }]
                        })
                    })
                })
            } else {
                return res.status(400).json({
                    messageBag: [{ msg: "Invalid existing password." }]
                })
            }
        })
    })
}
