const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan')

const app = express()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});
app.use(morgan('combined'))

mongoose.connect('mongodb://localhost:27017/movieRecommendationDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(8081)
