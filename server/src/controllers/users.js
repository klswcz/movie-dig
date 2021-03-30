const bcrypt = require("bcryptjs");
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const validator = require('../validator')
const WishlistItem = require('../models/WishlistItem');
const Rating = require('../models/Rating');
const {generateToken} = require("../generateToken");

exports.get = (req, res, next) => {
    User.findOne({email: req.params.token.username}, (err, model) => {
        return res.status(200).json({
            email: model.email,
            first_name: model.first_name,
            last_name: model.last_name
        })
    });
}

exports.store = (req, res, next) => {
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            return res.status(400).json({
                messageBag: [{msg: 'User with this email already exists.'}]
            });
        }
        return bcrypt.hash(req.body.password, 12).then(hashedPassword => {
            let userModel = new User({
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: hashedPassword
            })
            userModel.save(error => {
                return res.send({
                    flashMessageBag: [{msg: 'User has been registered.'}]
                });
            })
        })
    })
}

exports.update = (req, res, next) => {
    User.findOne({email: req.params.token.username}, (err, user) => {
        if (!user) {
            return res.status(400).json({
                messageBag: [{msg: 'User not found.'}]
            });
        }
        User.findOne({email: req.body.email}, (err, sameEmailUser) => {
            if (req.params.token.username !== req.body.email && sameEmailUser) {
                return res.status(400).json({
                    flashMessageBag: [{msg: 'User with this email already exists.'}]
                });
            }

            user.email = req.body.email
            user.first_name = req.body.first_name
            user.last_name = req.body.last_name

            user.save(error => {
                let token = generateToken(user)
                return res.status(200).send({
                    flashMessageBag: [{msg: 'Account has been updated.'}],
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    token: token
                });
            })
        })
    })
}

exports.destroy = (req, res, next) => {
    let promises = []

    User.findOne({email: req.params.token.username}, (err, user) => {
        promises.push(WishlistItem.deleteMany({user: {id: user.id}}))
        promises.push(Rating.deleteMany({user_id: user.id,}))

        Promise.all(promises).then(() => {
            user.remove().then(() => {
                return res.status(200).json({})
            })
        })
    })
}

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}).then(user => {
        if (!user) {
            return res.status(400).json({
                messageBag: [{msg: 'User not found.'}]
            });
        }
        return bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
            if (isPasswordValid) {

                let token = generateToken(user)

                return res.status(200).json({
                    flashMessageBag: [{msg: 'Logged in.'}],
                    token,
                    cart: user.cart
                })
            } else {
                return res.status(400).json({
                    messageBag: [{msg: 'Invalid password.'}]
                });
            }
        }).catch(error => {
            return res.status(500).json({
                flashMessageBag: [{msg: 'Internal error.'}]
            });
        })
    })
}

exports.updatePassword = (req, res, next) => {
    User.findOne({email: req.params.token.username}, (err, user) => {
        if (!user) {
            return res.status(400).json({
                messageBag: [{msg: 'User not found.'}]
            });
        }

        return bcrypt.compare(req.body.old_password, user.password).then(isPasswordValid => {
            if (isPasswordValid) {

                bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                    user.password = hashedPassword

                    user.save(error => {
                        if (error) {
                            return res.status(500).json({
                                flashMessageBag: [{msg: 'Internal error.'}]
                            })
                        } else {
                            return res.send({
                                flashMessageBag: [{msg: 'Password has been updated.'}]
                            });
                        }
                    })
                })

            } else {
                return res.status(400).json({
                    messageBag: [{msg: 'Invalid old password.'}]
                });
            }
        }).catch(error => {
            return res.status(500).json({
                flashMessageBag: [{msg: 'Internal error.'}]
            });
        })
    })
}
