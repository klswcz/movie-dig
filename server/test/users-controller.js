const bcrypt = require("bcryptjs")
const User = require("../src/models/User")
const { use, request } = require("chai")
const chaiHttp = require("chai-http")
const server = require("../src/app")

use(chaiHttp)
require("chai").should()

describe("Users controller", () => {
    it("should return account's details", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        return request(server)
                            .get("/account")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .then((res) => {
                                res.body.should.be.eql({
                                    email: "api_testing@moviedig.com",
                                    first_name: "Test",
                                    last_name: "User"
                                })
                                res.should.have.status(200)
                            })
                    })
            })
        })
    })

    it("should create new account", () => {
        return request(server)
            .post("/account")
            .type("form")
            .send({ email: "api_testing@moviedig.com", first_name: "Test", last_name: "User", password: "Pa$$w0rd!" })
            .then((res) => {
                res.should.have.status(200)
                res.body.should.be.eql({
                    messageBag: [{ msg: "Account has been created, please move to the login page now." }],
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User"
                })
            })
    })

    it("should throw a validation error when trying to create new account with invalid parameters", () => {
        return request(server)
            .post("/account")
            .type("form")
            .send({ email: "api_testing", first_name: "", last_name: "", password: "1234" })
            .then((res) => {
                res.should.have.status(400)
                res.body.should.be.eql({
                    messageBag: [
                        {
                            value: "api_testing",
                            msg: "Invalid email format.",
                            param: "email",
                            location: "body"
                        },
                        {
                            value: "",
                            msg: "Invalid first name.",
                            param: "first_name",
                            location: "body"
                        },
                        {
                            value: "",
                            msg: "Invalid last name.",
                            param: "last_name",
                            location: "body"
                        },
                        {
                            value: "1234",
                            msg: "Password needs to be between 8 and 50 characters long.",
                            param: "password",
                            location: "body"
                        }
                    ]
                })
            })
    })

    it("should throw an error when trying to create account with already existing email", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account")
                    .type("form")
                    .send({
                        email: "api_testing@moviedig.com",
                        first_name: "Test",
                        last_name: "User",
                        password: "Pa$$w0rd!"
                    })
                    .then((res) => {
                        res.should.have.status(400)
                        res.body.should.be.eql({ messageBag: [{ msg: "User with this email already exists." }] })
                    })
            })
        })
    })

    it("should update account's details", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        return request(server)
                            .patch("/account")
                            .type("form")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .send({
                                email: "api_testing@moviedig1.com",
                                first_name: "John",
                                last_name: "Smith"
                            })
                            .then((res) => {
                                return User.deleteOne({ email: "api_testing@moviedig1.com" }).then(() => {
                                    res.should.have.status(200)
                                    res.body.should.have.property("flashMessageBag")
                                    res.body.should.have.property("email", "api_testing@moviedig1.com")
                                    res.body.should.have.property("first_name", "John")
                                    res.body.should.have.property("last_name", "Smith")
                                })
                            })
                    })
            })
        })
    })

    it("should throw a validation error when trying to update account's details with invalid parameters", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        return request(server)
                            .patch("/account")
                            .type("form")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .send({
                                email: "api_testing",
                                first_name: "",
                                last_name: ""
                            })
                            .then((res) => {
                                res.should.have.status(400)
                                res.body.should.be.eql({
                                    messageBag: [
                                        {
                                            value: "api_testing",
                                            msg: "Invalid email format.",
                                            param: "email",
                                            location: "body"
                                        },
                                        {
                                            value: "",
                                            msg: "Invalid first name.",
                                            param: "first_name",
                                            location: "body"
                                        },
                                        {
                                            value: "",
                                            msg: "Invalid last name.",
                                            param: "last_name",
                                            location: "body"
                                        }
                                    ]
                                })
                            })
                    })
            })
        })
    })

    it("should delete account and all of it's ratings and wishlist items", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        return request(server)
                            .post("/wishlist")
                            .type("form")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .send({ movie_id: 862 })
                            .then(() => {
                                return request(server)
                                    .post("/ratings")
                                    .type("form")
                                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                                    .send({ rating: 4.5, movie_id: 862 })
                                    .then(() => {
                                        return request(server)
                                            .delete("/account")
                                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                                            .send()
                                            .then((res) => {
                                                res.should.have.status(200)
                                                res.body.should.be.eql({
                                                    flashMessageBag: [{ msg: "Account has been deleted." }]
                                                })
                                            })
                                    })
                            })
                    })
            })
        })
    })

    it("should generate new JWT token when logging in", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        loginRes.should.have.status(200)
                        loginRes.body.should.have.property("flashMessageBag")
                    })
            })
        })
    })

    it("should not generate new JWT token if password is incorrect", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "zaq1@WSX" })
                    .then((loginRes) => {
                        loginRes.should.have.status(400)
                        loginRes.body.should.have.be.eql({
                            messageBag: [{ msg: "Email address and/or password is invalid." }]
                        })
                    })
            })
        })
    })

    it("should not generate new JWT token if email is incorrect", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "wrong_email@domain.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        loginRes.should.have.status(400)
                        loginRes.body.should.have.be.eql({
                            messageBag: [{ msg: "Email address and/or password is invalid." }]
                        })
                    })
            })
        })
    })

    it("should update the password", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        return request(server)
                            .post("/account/password")
                            .type("form")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .send({
                                password: "zaq1@WSX",
                                old_password: "Pa$$w0rd!"
                            })
                            .then((res) => {
                                res.should.have.status(200)
                                res.body.should.be.eql({ flashMessageBag: [{ msg: "Password has been updated." }] })
                            })
                    })
            })
        })
    })

    it("should not update the password if passed parameter doesn't match existing password", () => {
        return bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
            return User.create(
                new User({
                    email: "api_testing@moviedig.com",
                    first_name: "Test",
                    last_name: "User",
                    password: hashedPassword
                })
            ).then(() => {
                return request(server)
                    .post("/account/login")
                    .type("form")
                    .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
                    .then((loginRes) => {
                        return request(server)
                            .post("/account/password")
                            .type("form")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .send({
                                password: "zaq1@WSX",
                                old_password: "old-password-wr0ng"
                            })
                            .then((res) => {
                                res.should.have.status(400)
                                res.body.should.be.eql({ messageBag: [{ msg: "Invalid existing password." }] })
                            })
                    })
            })
        })
    })

    afterEach(() => {
        return new Promise((resolve) => {
            User.deleteOne({ email: "api_testing@moviedig.com" }).then(() => {
                resolve()
            })
        })
    })
})
