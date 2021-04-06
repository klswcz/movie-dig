const bcrypt = require("bcryptjs")
let User = require('../src/models/User')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../src/app')
let should = chai.should()
const {generateToken} = require("../src/generateToken")
const jwt = require('jsonwebtoken')

chai.use(chaiHttp);

let userModel = {}

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

    it('should throw validation error when Authorization token is expired', function () {

            const expiredToken = jwt.sign(
                {
                    id: userModel._id,
                    username: userModel.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: -1 // token with expiration date in the past
                }
            );

            return chai.request(server)
                .get('/movies/trending') // route accessible to every logged in user
                .set('Authorization', `Bearer ${expiredToken}`)
                .then((res) => {
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
            )).then((user) => {
                userModel = user
            })
        })
    })

    afterEach(() => {
        return User.deleteOne({email: 'api_testing@moviedig.com'})
    })
})
