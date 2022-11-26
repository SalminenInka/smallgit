"use strict";
const express = require('express');
const app = express();
app.get('/', function (req, res) {
    res.send('Hello Git');
});
console.log('Other branch annihilated');
app.listen(6666);
