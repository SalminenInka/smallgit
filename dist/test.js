"use strict";
const express = require('express');
const app = express();
app.get('/', function (req, res) {
    res.send('Hello Git');
});
console.log('Trying out the branch merge');
app.listen(6666);
