const bcrypt = require("bcryptjs")
const User = require("../src/models/User")
const WishlistItem = require("../src/models/WishlistItem")
const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../src/app")
const Rating = require("../src/models/Rating")
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

describe("Wishlit items controller", () => {
    it("should create new wishlist item", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((loginRes) => {
                loginRes.should.have.status(200)
                return chai
                    .request(server)
                    .post("/wishlist")
                    .type("form")
                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                    .send({ movie_id: 862 })
                    .then((res) => {
                        res.should.have.status(200)
                        res.body.should.be.eql({
                            flashMessageBag: [{ msg: "Movie has been added to wish list." }],
                            isWishlistItem: true
                        })
                        new Promise((resolve) => {
                            WishlistItem.deleteMany({ user: { id: userModel.id } }).then(() => {
                                resolve()
                            })
                        })
                    })
            })
    })

    it("should throw an error when trying to create wishlist item without adding movie id to request", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((loginRes) => {
                loginRes.should.have.status(200)
                return chai
                    .request(server)
                    .post("/wishlist")
                    .type("form")
                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                    .then((res) => {
                        res.should.have.status(400)
                        res.body.should.be.eql({
                            messageBag: [{ msg: "Invalid value", param: "movie_id", location: "body" }]
                        })
                    })
            })
    })

    it("should return all wishlist items assigned to the user", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((loginRes) => {
                loginRes.should.have.status(200)
                return chai
                    .request(server)
                    .post("/wishlist")
                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                    .send({ movie_id: 862 })
                    .then((res) => {
                        return chai
                            .request(server)
                            .get("/wishlist")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .then((res) => {
                                res.should.have.status(200)
                                res.body.wishlistItems.forEach((movie) => {
                                    expect(movie).to.include.keys(tmdbKeyWithUserRating)
                                })
                                new Promise((resolve) => {
                                    WishlistItem.deleteMany({ user: { id: userModel.id } }).then(() => {
                                        resolve()
                                    })
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
