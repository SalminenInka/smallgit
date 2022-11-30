import express, { Request, Response, NextFunction } from 'express';
import { expressjwt as jwt } from 'express-jwt';
import { readFileSync } from 'fs';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';
 
const debug: NodeRequire = require('debug')('app');
const app = express();
const fileName: string = './public-key.pem';
const contents: string = readFileSync(fileName, 'utf-8');
<<<<<<< HEAD

app.use(express.json());

=======
 
app.use(express.json());
 
>>>>>>> 909d21d5aa74326f42d008081dcfcc46157f9e24
const client = new Client({
  host: process.env.DB_HOST,
  port: 5432, // <- not ok
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
client.connect();
 
interface GetRequest extends Request {
  params: {
    id: string;
  },
  auth: object;
}

<<<<<<< HEAD
interface GetRequest<T = any> extends Request {
  params: {
    id: string;
  },
  auth?: object;
}

=======
>>>>>>> 909d21d5aa74326f42d008081dcfcc46157f9e24
interface PostRequest<T = any> extends Request {
  params: {
    id: string;
  },
<<<<<<< HEAD
  body: T;
}

// Retrieve some data on one user with user_id
// No token needed for this action
app.get('/database/:id', async (req: GetRequest<{ id: string}>, res: Response) => {
=======
  body: T,
  auth: object;
}

interface DeleteRequest extends Request {
  auth: object;
}
 
app.use(jwt({ secret: contents, algorithms: ["RS256"], audience: process.env.AUD }));
// Create new data
app.post('/database', async (req: PostRequest<{ logger: string }>, res: Response) => {
  const logger = req.body.logger;
  const userId = uuidv4();
  try{
    await client
    .query('INSERT INTO crud (user_id, user_name) VALUES ($1, $2)', [userId, logger]);
    res.json(userId);
  } catch {
    res.status(500).json('Goodbye.');
  }
});
// Retrieve all data
app.get('/database', async (req: GetRequest, res: Response) => {
  try{
    const rows = await client
    .query('SELECT user_id, user_name, stamp FROM crud');
    console.log(req.auth);
    res.json(rows.rows);
  } catch {
    res.status(500).json('Goodbye.');
  }
});
// Retrieve some data on one user with user_id
app.get('/database/:id', async (req: GetRequest, res: Response) => {
>>>>>>> 909d21d5aa74326f42d008081dcfcc46157f9e24
  try {
    const rows = await client
    .query('SELECT user_name, stamp FROM crud WHERE user_id = ($1)', [req.params.id]);
    res.json(rows.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});
<<<<<<< HEAD
// The gate-keeping JWT startts here
app.use(jwt({ secret: contents, algorithms: ["RS256"] }));
// Create new data

app.post('/database', async (req: PostRequest<{ logger: string }>, res: Response) => {
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
app.get('/database', async (req: Request, res: Response) => {
  try{
    const rows = await client
      .query('SELECT user_id, user_name, stamp FROM crud');
      res.json(rows.rows);
  } catch {
    res.status(500).json('Goodbye.');
  }
});
=======
>>>>>>> 909d21d5aa74326f42d008081dcfcc46157f9e24
// Update data with user_id, under construction
app.put('/database/:id', async (req: PostRequest<{ logger: string }>, res: Response) => {
  try {
    const logger = req.body.logger;
    console.log(logger);
    await client
    .query('UPDATE crud SET user_name = ($1) WHERE user_id = ($2)', [logger, req.params.id])
    console.log(req.auth);
    res.json('User updated');
  } catch (err) {
    res.status(500).send(err);
  }
});
// Delete according to user_id
<<<<<<< HEAD
app.delete('/database/:id', async (req: Request, res: Response) => {
=======
app.delete('/database/:id', async (req: DeleteRequest, res: Response) => {
>>>>>>> 909d21d5aa74326f42d008081dcfcc46157f9e24
  try{
    await client
    .query('DELETE FROM crud WHERE user_id = ($1)', [req.params.id]);
    console.log(req.auth);
    res.json(`User deleted from db`);
  } catch (err) {
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