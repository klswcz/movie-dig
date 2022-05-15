const bcrypt = require("bcryptjs")
const User = require("../src/models/User")
const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../src/app")
const should = chai.should()
const jwt = require("jsonwebtoken")

chai.use(chaiHttp)

let userModel = {}

describe("jwtAuth", () => {
    it("should throw validation error when Authorization token is missing", function () {
        return chai
            .request(server)
            .get("/account") // route accessible to every logged in user
            .then((res) => {
                res.body.should.be.eql({ messageBag: [{ msg: "Invalid JWT token." }] })
                res.should.have.status(401)
            })
    })

    it("should throw validation error when Authorization token is not valid", function () {
        return chai
            .request(server)
            .get("/account") // route accessible to every logged in user
            .set("Authorization", "invalid_token")
            .then((res) => {
                res.body.should.be.eql({ messageBag: [{ msg: "Invalid JWT token." }] })
                res.should.have.status(401)
            })
    })

    it("should throw validation error when Authorization token is expired", function () {
        const expiredToken = jwt.sign(
            {
                id: userModel._id,
                username: userModel.email
            },
            process.env.JWT_SECRET,
            { expiresIn: -1 } // token with expiration date in the past
        )

        return chai
            .request(server)
            .get("/account") // route accessible to every logged in user
            .set("Authorization", `Bearer ${expiredToken}`)
            .then((res) => {
                res.body.should.be.eql({ messageBag: [{ msg: "Invalid JWT token." }] })
                res.should.have.status(401)
            })
    })

    it("should let logged in user access the protected route", function () {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((res) => {
                res.body.flashMessageBag.should.be.eql([{ msg: "Logged in." }])
                res.should.have.status(200)
                return chai
                    .request(server)
                    .get("/account") // route accessible to every logged in user
                    .set("Authorization", `Bearer ${res.body.token}`)
                    .then((res) => {
                        res.body.should.be.eql({ email: "api_testing@moviedig.com" })
                        res.should.have.status(200)
                    })
            })
    })

    beforeEach(() => {
        return new Promise((resolve) => {
            bcrypt.hash("Pa$$w0rd!", 12).then((hashedPassword) => {
                User.create(
                    new User({
                        email: "api_testing@moviedig.com",
                        password: hashedPassword
                    })
                ).then((user) => {
                    userModel = user
                    resolve()
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
