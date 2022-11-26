"use strict";
const express = require('express');
const app = express();
app.get('/', function (req, res) {
    res.send('Hello Git');
});
console.log('merge me, daddy!');
app.listen(6666);
