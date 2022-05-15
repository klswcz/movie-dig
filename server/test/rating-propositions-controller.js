const bcrypt = require("bcryptjs")
const User = require("../src/models/User")
const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../src/app")
const should = chai.should()
const expect = chai.expect
const jwt = require("jsonwebtoken")

chai.use(chaiHttp)

let userModel = {}
const tmdbResponseKeys = [
    "adult",
    "backdrop_path",
    "id",
    "original_language",
    "original_title",
    "overview",
    "popularity",
    "poster_path",
    "release_date",
    "title",
    "video",
    "vote_average",
    "vote_count"
]
const tmdbKeyWithUserRating = [...tmdbResponseKeys, "user_rating"]

describe("Rating propositions controller", () => {
    it("should return rating propositions array including user ratings", () => {
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
                    .get("/rating-propositions")
                    .set("Authorization", `Bearer ${res.body.token}`)
                    .then((res) => {
                        res.body.propositions.length.should.be.eql(5)
                        res.should.have.status(200)
                        res.body.propositions.forEach((propositionsGroup) => {
                            propositionsGroup.movies.forEach((movie) => {
                                expect(movie).to.include.keys(tmdbKeyWithUserRating)
                            })
                        })
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
