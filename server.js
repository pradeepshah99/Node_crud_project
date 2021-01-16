const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');

require('dotenv').config();

var port = process.env.port;
var host = process.env.host;

app.use(bodyPaser.urlencoded({extended:true}));
app.use(bodyPaser.json());
app.use(cors());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

const url = "mongodb://localhost:27017/project_db";

mongoose.connect(url, {useUnifiedTopology:true, useNewUrlParser:true});
var db = mongoose.connection;

db.once('open', (req, res)=>
{
    console.log('Connection Has been established');

});

var controller = require('./userCtrl');
app.use('/api/user', controller);




app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});