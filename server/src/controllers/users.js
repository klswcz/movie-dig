const bcrypt = require("bcryptjs");
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const validator = require('../validator')
const {generateToken} = require("../generateToken");

exports.register = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (!errors.isEmpty()) {
        res.status(400).json({messageBag: errors.array()});
    }

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
}

exports.login = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (!errors.isEmpty()) {
        res.status(400).json({messageBag: errors.array()});
    }

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
}

exports.account = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (!errors.isEmpty()) {
        res.status(400).json({messageBag: errors.array()});
    }

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
}
