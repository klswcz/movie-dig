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

describe("Movies controller", () => {
    it("should return trending movies from TMDb", () => {
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
                    .get("/movies/trending")
                    .set("Authorization", `Bearer ${res.body.token}`)
                    .then((res) => {
                        const tmdbKeyWithUserRating = [...tmdbResponseKeys, "user_rating"]
                        res.body.movies.forEach((movie) => {
                            expect(movie).to.include.keys(tmdbKeyWithUserRating)
                        })
                        res.body.movies.length.should.be.eql(20)
                        res.should.have.status(200)
                    })
            })
    })

    it("should return no recommended movies from Python script if user has not rated at least 20 movies", () => {
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
                    .get("/movies/recommendations")
                    .set("Authorization", `Bearer ${res.body.token}`)
                    .then((res) => {
                        res.body.should.be.eql({ movies: null, ratings_required: 20, ratings_given: 0 })
                        res.should.have.status(200)
                    })
            })
    })

    it("should return TMDb object for a movie with a given TMDb ID that is not added to a wish list", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((res) => {
                res.should.have.status(200)
                return chai
                    .request(server)
                    .get("/movies/129")
                    .set("Authorization", `Bearer ${res.body.token}`)
                    .then((res) => {
                        expect(res.body).to.have.keys(["movie", "isWishlistItem"])
                        expect(res.body.isWishlistItem).to.be.eql(false)
                        expect(res.body.movie).to.include.keys(tmdbResponseKeys)
                        res.should.have.status(200)
                    })
            })
    })

    it("should return TMDb object for a movie with a given TMDb ID that is added to a wish list", () => {
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
                    .send({ movie_id: 129 })
                    .then((res) => {
                        return chai
                            .request(server)
                            .get("/movies/129")
                            .set("Authorization", `Bearer ${loginRes.body.token}`)
                            .then((res) => {
                                expect(res.body).to.have.keys(["movie", "isWishlistItem"])
                                expect(res.body.isWishlistItem).to.be.eql(true)
                                expect(res.body.movie).to.include.keys(tmdbResponseKeys)
                                res.should.have.status(200)
                            })
                    })
            })
    })

    it("should return an error when wrong ID is sent to /movies endpoint", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((loginRes) => {
                loginRes.should.have.status(200)
                return chai
                    .request(server)
                    .get("/movies/0")
                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                    .then((res) => {
                        res.should.have.status(404)
                    })
            })
    })

    it("should return an array of movies based on search query", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((loginRes) => {
                loginRes.should.have.status(200)
                return chai
                    .request(server)
                    .get("/movies/search")
                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                    .query({ query: "Spider-man" })
                    .then((res) => {
                        res.body.results.forEach((movie) => {
                            expect(movie).to.include.keys(tmdbResponseKeys)
                        })
                        expect(res.body.results.length).to.be.within(0, 7)
                        res.should.have.status(200)
                    })
            })
    })

    it("should return a validation error for empty search query", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((loginRes) => {
                loginRes.should.have.status(200)
                return chai
                    .request(server)
                    .get("/movies/search")
                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                    .query({ query: "" })
                    .then((res) => {
                        res.body.should.eql({
                            messageBag: [
                                {
                                    msg: "Invalid value",
                                    param: "query",
                                    location: "query",
                                    value: ""
                                }
                            ]
                        })
                        res.should.have.status(400)
                    })
            })
    })

    it("should return a validation error for no search query", () => {
        return chai
            .request(server)
            .post("/account/login")
            .type("form")
            .send({ email: "api_testing@moviedig.com", password: "Pa$$w0rd!" })
            .then((loginRes) => {
                loginRes.should.have.status(200)
                return chai
                    .request(server)
                    .get("/movies/search")
                    .set("Authorization", `Bearer ${loginRes.body.token}`)
                    .then((res) => {
                        res.body.should.eql({
                            messageBag: [{ msg: "Invalid value", param: "query", location: "query" }]
                        })
                        res.should.have.status(400)
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
