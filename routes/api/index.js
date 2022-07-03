const express = require('express');
const app = express.Router();

app.use('/', require('./app'));
app.use('/auth', require('./auth'));
app.use('/users', require('./users'));
app.use('/issues', require('./issues'));

module.exports = app;                   