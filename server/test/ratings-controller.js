const bcrypt = require("bcryptjs")
let User = require('../src/models/User')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../src/app')
const Rating = require('../src/models/Rating');
let should = chai.should()
let expect = chai.expect
const jwt = require('jsonwebtoken')

chai.use(chaiHttp);

let userModel = {}
let tmdbResponseKeys = ["adult", "backdrop_path", "id", "original_language", "original_title", "overview", "popularity", "poster_path", "release_date", "title", "video", "vote_average", "vote_count"]
let tmdbKeyWithUserRating = [...tmdbResponseKeys, 'user_rating']

describe('Rating propositions controller', () => {

    it('should create new rating', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 3.5, movie_id: 862})
                    .then(res => {
                        res.should.have.status(200)
                        res.body.should.be.eql({flashMessageBag: [{msg: 'Rating has been saved.'}], rating: '3.5', "rating_count": 1})
                        new Promise(resolve => {
                            Rating.deleteMany({user_id: userModel.id}).then(() => {
                                resolve()
                            })
                        })
                    })
            })
    });

    it('should throw an error when trying to create rating without adding its value to request', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .then(res => {
                        res.should.have.status(400)
                        res.body.should.be.eql({
                            messageBag: [
                                {msg: 'Invalid value', param: 'rating', location: 'body'},
                                {msg: 'Invalid value', param: 'movie_id', location: 'body'}
                            ]
                        })
                    })
            })
    });

    it('should throw an error when trying to create rating with invalid value to request', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 12345, movie_id: 862})
                    .then(res => {
                        res.should.have.status(400)
                        res.body.should.be.eql({
                            messageBag: [
                                {
                                    value: '12345',
                                    msg: 'Invalid value',
                                    param: 'rating',
                                    location: 'body'
                                }
                            ]
                        })
                    })
            })
    });

    it('should update rating', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 3.5, movie_id: 862})
                    .then(res => {
                        return chai.request(server)
                            .patch('/ratings')
                            .type('form')
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                            .send({rating: 5, movie_id: 862})
                            .then(res => {
                                res.should.have.status(200)
                                res.body.should.be.eql({
                                    flashMessageBag: [{msg: 'Rating has been updated.'}],
                                    rating: '5',
                                    "rating_count": 1
                                })

                                new Promise(resolve => {
                                    Rating.deleteMany({user_id: userModel.id}).then(() => {
                                        resolve()
                                    })
                                })
                            })
                    })
            })
    });

    it('should throw an error when trying to update rating without adding its value to request', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 3.5, movie_id: 862})
                    .then(res => {
                        return chai.request(server)
                            .patch('/ratings')
                            .type('form')
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                            .then(res => {
                                res.should.have.status(400)
                                res.body.should.be.eql({
                                    messageBag: [
                                        {msg: 'Invalid value', param: 'rating', location: 'body'},
                                        {msg: 'Invalid value', param: 'movie_id', location: 'body'}
                                    ]
                                })

                                new Promise(resolve => {
                                    Rating.deleteMany({user_id: userModel.id}).then(() => {
                                        resolve()
                                    })
                                })
                            })
                    })
            })
    });

    it('should throw an error when trying to update rating with invalid value to request', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 3.5, movie_id: 862})
                    .then(res => {
                        return chai.request(server)
                            .patch('/ratings')
                            .type('form')
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                            .send({rating: 1234, movie_id: 862})
                            .then(res => {
                                res.should.have.status(400)
                                res.body.should.be.eql({
                                    messageBag: [
                                        {
                                            value: '1234',
                                            msg: 'Invalid value',
                                            param: 'rating',
                                            location: 'body'
                                        }
                                    ]
                                })

                                new Promise(resolve => {
                                    Rating.deleteMany({user_id: userModel.id}).then(() => {
                                        resolve()
                                    })
                                })
                            })
                    })
            })
    });

    it('should return rating with a given ID', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 3.5, movie_id: 862})
                    .then(res => {
                        return chai.request(server)
                            .get('/ratings/862')
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                            .then(res => {
                                res.should.have.status(200)
                                res.body.should.be.eql({rating: '3.5'})
                                new Promise(resolve => {
                                    Rating.deleteMany({user_id: userModel.id}).then(() => {
                                        resolve()
                                    })
                                })
                            })
                    })
            })
    });

    it('should remove rating with a given ID', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 3.5, movie_id: 862})
                    .then(res => {
                        return chai.request(server)
                            .delete('/ratings')
                            .type('form')
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                            .send({movie_id: 862})
                            .then(res => {
                                res.should.have.status(200)
                            })
                    })
            })
    });

    it('should throw an error when trying to remove rating for a non-existing movie', () => {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(loginRes => {
                loginRes.should.have.status(200)
                return chai.request(server)
                    .post('/ratings')
                    .type('form')
                    .set('Authorization', `Bearer ${loginRes.body.token}`)
                    .send({rating: 3.5, movie_id: 862})
                    .then(res => {
                        return chai.request(server)
                            .delete('/ratings')
                            .type('form')
                            .set('Authorization', `Bearer ${loginRes.body.token}`)
                            .send({movie_id: 123456789})
                            .then(res => {
                                res.should.have.status(400)
                                res.body.should.be.eql({
                                    messageBag: [{msg: 'Rating was not found.'}]
                                })
                                new Promise(resolve => {
                                    Rating.deleteMany({user_id: userModel.id}).then(() => {
                                        resolve()
                                    })
                                })
                            })
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
