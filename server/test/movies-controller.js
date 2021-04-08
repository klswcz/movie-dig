const bcrypt = require("bcryptjs")
let User = require('../src/models/User')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../src/app')
let should = chai.should()
let expect = chai.expect
const jwt = require('jsonwebtoken')

chai.use(chaiHttp);

let userModel = {}
let tmdbResponseKeys = ["adult", "backdrop_path", "id", "original_language", "original_title", "overview", "popularity", "poster_path", "release_date", "title", "video", "vote_average", "vote_count"]

describe('Movies controller', () => {
    it('should return trending movies from TMDb', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(res => {
                res.body.flashMessageBag.should.be.eql([{msg: 'Logged in.'}])
                res.should.have.status(200)
                return chai.request(server)
                    .get('/movies/trending')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .then(res => {
                        res.body.movies.length.should.be.eql(20);
                        res.should.have.status(200)
                    })
            })
    });

    it('should return IDs of recommended movies from Python script and add information from TMDb to each of them', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(res => {
                res.body.flashMessageBag.should.be.eql([{msg: 'Logged in.'}])
                res.should.have.status(200)
                return chai.request(server)
                    .get('/movies/recommendations')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .then(res => {
                        res.body.movies.forEach((movie) => {
                            Object.keys(movie).length.should.be.eql(25)
                            expect(movie).to.include.keys(tmdbResponseKeys)
                        })
                        res.should.have.status(200)
                    })
            })
    });

    it('should return TMDb object for a movie with a given TMDb ID that is not added to a wish list', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(res => {
                res.should.have.status(200)
                return chai.request(server)
                    .get('/movies/129')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .then(res => {
                        expect(res.body).to.have.keys(['movie', 'isWishlistItem'])
                        expect(res.body.isWishlistItem).to.be.eql(false)
                        expect(res.body.movie).to.include.keys(tmdbResponseKeys)
                        res.should.have.status(200)
                    })
            })
    });

    it('should return TMDb object for a movie with a given TMDb ID that is added to a wish list', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)

                return chai.request(server)
                    .post('/wishlist')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({movie_id: 129})
                    .then(res => {
                        return chai.request(server)
                            .get('/movies/129')
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                            .then(res => {
                                expect(res.body).to.have.keys(['movie', 'isWishlistItem'])
                                expect(res.body.isWishlistItem).to.be.eql(true)
                                expect(res.body.movie).to.include.keys(tmdbResponseKeys)
                                res.should.have.status(200)
                            })
                    })
            })
    });

    it('should return an error when wrong ID is sent', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .get('/movies/0')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .then(res => {
                        res.should.have.status(404)
                    }).catch((err) => {
                        console.log(err);
                        err.should.have.status(404)
                    })
            })
    });

    it('should return an error when no ID is sent', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .get('/movies')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .then(res => {
                        res.should.have.status(404)
                    })
            })
    });


    beforeEach(() => {
        return new Promise((resolve => {
                bcrypt.hash('Pa$$w0rd!', 12).then(hashedPassword => {
                    User.create((new User({
                            email: 'api_testing@moviedig.com',
                            password: hashedPassword
                        })
                    )).then((user) => {
                        userModel = user
                        resolve()
                    })
                })
            })
        )
    })

    afterEach(() => {
        return new Promise(resolve => {
            User.deleteOne({email: 'api_testing@moviedig.com'}).then(() => {
                resolve()
            })
        })
    })
})
