const bcrypt = require("bcryptjs");
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const validator = require('../src/validator')
const {generateToken} = require("../src/generateToken");

exports.register = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (errors.isEmpty()) {
        User.findOne({email: req.body.email}).then(user => {
            if (user) {
                return res.status(400).json({
                    messageBag: [{msg: 'User with this email already exists.'}]
                });
            }
            return bcrypt.hash(req.body.password, 12).then(hashedPassword => {
                let userModel = new User({
                    email: req.body.email,
                    password: hashedPassword
                })
                userModel.save(error => {
                    if (error) {
                        return res.status(500).json({
                            messageBag: [{msg: 'Internal error.'}]
                        })
                    } else {
                        return res.send({
                            messageBag: [{msg: 'User has been registered.'}]
                        });
                    }
                })
            })
        })
    } else {
        res.status(422).json({
            messageBag: errors.array()
        });
    }
}


exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send();
        }

        return res.status(200).send();
    })
}

exports.login = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (errors.isEmpty()) {
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
                        messageBag: [{msg: 'Logged in.'}],
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
                    messageBag: [{msg: 'Internal error.'}]
                });
            })
        })
    } else {
        res.status(422).json({
            messageBag: errors.array()
        });
    }
}

exports.account = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);

    if (errors.isEmpty()) {
        jwt.verify(req.headers.authorization.substring(7), process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({
                    messageBag: [{msg: 'User not found.'}]
                });
            }
            User.findOne({email: user.username}, (err, model) => {
                return res.status(200).json({
                    email: model.email
                })
            });
        })
    } else {
        res.status(422).json({
            messageBag: errors.array()
        });
    }
}
