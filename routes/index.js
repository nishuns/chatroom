const express = require('express');
const app = express.Router();

app.use('/', require('./api/index'));

module.exports = app;                   