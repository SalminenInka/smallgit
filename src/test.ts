const express = require('express');
const app = express();
const { expressjwt: jwt } = require('express-jwt');
const { readFileSync } = require('fs');
const debug = require('debug')('app');
const { Client } = require('pg');
const fileName: string = './public-key.pem';
const contents: string = readFileSync(fileName, 'utf-8');
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
app.get('/database/:id', async (req: { params: { id: any; }; }, res: { json: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    const rows = await client
    .query('SELECT user_name, stamp FROM crud WHERE user_id = ($1)', [req.params.id]);
    res.json(rows.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});
// The gate-keeping JWT startts here
app.use(jwt({ secret: contents, algorithms: ["RS256"] }));
// Create new data
app.post('/database', async (req: { body: { logger: any; }; }, res: { json: (arg0: string) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): void; new(): any; }; }; }) => {
  const logger = req.body.logger;
  const userId = uuidv4();
  console.log(logger);
  console.log(userId);
  try{
    await client
      .query('INSERT INTO crud (user_id, user_name) VALUES ($1, $2)', [userId, logger]);
      res.json(`${logger} logged with JWT`);
  } catch {
    res.status(500).json('Goodbye.');
  }
});
// Retrieve all data 
app.get('/database', async (req: { body: { logger: any; }; }, res: { json: (arg0: string) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): void; new(): any; }; }; }) => {

  try{
    const rows = await client
      .query('SELECT user_id, user_name, stamp FROM crud');
      res.json(rows.rows);
  } catch {
    res.status(500).json('Goodbye.');
  }
});
// Update data with user_id
app.put('/database/:id', async (req: { body: { logger: any; }; params: { id: any; }; }, res: { json: (arg0: string) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: unknown): void; new(): any; }; }; }) => {
  try {
    const logger = req.body.logger;
    console.log(logger);
    await client
    .query('UPDATE crud SET user_name = ($1) WHERE user_id = ($2)', [logger, req.params.id])
    res.json('User updated');
  } catch (err) {
    res.status(500).send(err);
  }
});
// Delete according to user_id
app.delete('/database/:id', async (req: {
  params: any; body: { logger: any; }; 
}, res: { json: (arg0: string) => void; status: (arg0: number) => {
  send(err: unknown): unknown; (): any; new(): any; json: { (arg0: string): void; new(): any; }; 
}; }) => {
  try{
    await client
      .query('DELETE FROM crud WHERE user_id = ($1)', [req.params.id]);
      res.json(`User deleted from db`);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Set port from env or by default 8080
const port: number = +(process.env.PORT || '8080');
const server = app.listen(port, () => {
  debug(`Running on ${port}`);
});

  
process.on('SIGTERM', () => {
  debug('SIGTERM signal received, closing the HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
});

