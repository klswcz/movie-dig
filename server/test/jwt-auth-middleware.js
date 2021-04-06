let mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
let User = require('../src/models/User')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../src/app')
let should = chai.should()
let expect = chai.expect()
let done = chai.done
const {generateToken} = require("../src/generateToken")

chai.use(chaiHttp);

describe('jwtAuth', () => {
    it('should throw validation error when Authorization token is missing', function () {
        chai.request(server)
            .get('/movies/trending') // route accessible to every logged in user
            .end((err, res) => {
                res.should.have.status(401)
            })
    });

    it('should throw validation error when Authorization token is not valid', function () {
        chai.request(server)
            .get('/movies/trending') // route accessible to every logged in user
            .set('Authorization', 'invalid_token')
            .end((err, res) => {
                res.should.have.status(401)
            })
    });

    it('should let logged in user access the protected route', function () {
        return chai.request(server)
            .post('/account/login')
            .type('form')
            .send({email: 'api_testing@moviedig.com', password: 'Pa$$w0rd!'})
            .then(res => {
                res.should.have.status(200)
                return chai.request(server)
                    .get('/movies/trending') // route accessible to every logged in user
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .then( res => {
                        res.should.have.status(200)
                    })
            })
    });

    beforeEach(() => {
        return bcrypt.hash('Pa$$w0rd!', 12).then(hashedPassword => {
            User.create((new User({
                    email: 'api_testing@moviedig.com',
                    password: hashedPassword
                })
            ))
        })
    })

    afterEach(() => {
        return User.deleteOne({email: 'api_testing@moviedig.com'})
    })
})
