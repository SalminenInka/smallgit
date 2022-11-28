"use strict";
const express = require('express');
const app = express();
const { expressjwt: jwt } = require('express-jwt');
const { readFileSync } = require('fs');
const debug = require('debug')('app');
const { Client } = require('pg');
const fileName = './public-key.pem';
const contents = readFileSync(fileName, 'utf-8');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});
client.connect();
// Retrieve some data on one user with user_id
// No token needed for this action
app.get('/database/:id', async (req, res) => {
    try {
        const rows = await client
            .query('SELECT user_name, stamp FROM crud WHERE user_id = ($1)', [req.params.id]);
        res.json(rows.rows);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// The gate-keeping JWT
app.use(jwt({ secret: contents, algorithms: ["RS256"] }));
// Create new data
app.post('/database', async (req, res) => {
    const logger = req.body.logger;
    const ownId = uuidv4();
    console.log(logger);
    console.log(ownId);
    try {
        await client
            .query('INSERT INTO crud (user_id, user_name) VALUES ($1, $2)', [ownId, logger]);
        res.json(`${logger} logged with JWT`);
    }
    catch {
        res.status(500).json('Goodbye.');
    }
});
// Retrieve all data 
app.get('/database', async (req, res) => {
    try {
        const rows = await client
            .query('SELECT user_id, user_name, stamp FROM crud');
        res.json(rows.rows);
    }
    catch {
        res.status(500).json('Goodbye.');
    }
});
// Update data with user_id
app.put('/database/:id', async (req, res) => {
    try {
        const logger = req.body.logger;
        console.log(logger);
        await client
            .query('UPDATE crud SET user_name = ($1) WHERE user_id = ($2)', [logger, req.params.id]);
        res.json('User updated');
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// Delete according to user_id
app.delete('/database/:id', async (req, res) => {
    try {
        await client
            .query('DELETE FROM crud WHERE user_id = ($1)', [req.params.id]);
        res.json(`User deleted from db`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
// Set port from env or by default 8080
const port = +(process.env.PORT || '8080');
const server = app.listen(port, () => {
    debug(`Running on ${port}`);
});
process.on('SIGTERM', () => {
    debug('SIGTERM signal received, closing the HTTP server');
    server.close(() => {
        debug('HTTP server closed');
    });
});
//# sourceMappingURL=test.js.map