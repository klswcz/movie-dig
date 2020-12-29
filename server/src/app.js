const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const usersRoutes = require('../routes/users')
const dotenv = require('dotenv').config()

const app = express()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_APP_URL);
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const jwtMiddleware = expressJwt({
    secret: process.env.JWT_SECRET, algorithms: ['RS256']
});

mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(usersRoutes)

app.listen(process.env.APP_PORT)
