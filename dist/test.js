"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
;
const express_jwt_1 = require("express-jwt");
const fs_1 = require("fs");
const pg_1 = require("pg");
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const debug = require('debug')('app');
const app = (0, express_1.default)();
const fileName = './public-key.pem';
const contents = (0, fs_1.readFileSync)(fileName, 'utf-8');
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
const client = new pg_1.Client({
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
// The gate-keeping JWT startts here
app.use((0, express_jwt_1.expressjwt)({ secret: contents, algorithms: ["RS256"] }));
// Create new data
app.post('/database', async (req, res) => {
    const logger = req.body.logger;
    const userId = (0, uuid_1.v4)();
    console.log(logger);
    console.log(userId);
    try {
        await client
            .query('INSERT INTO crud (user_id, user_name) VALUES ($1, $2)', [userId, logger]);
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