const express = require('express');
const app = express();
const { expressjwt: jwt } = require('express-jwt');
const { readFileSync } = require('fs');
const debug = require('debug')('app');

const fileName: string = './public-key.pem';
const contents: string = readFileSync(fileName, 'utf-8');

let tester: string = 'Hello JWT';
if (tester !== 'Hello Token!') {
  tester = 'Hello Json Web Token';
} else {
  tester = 'Goodbye Token';
}
app.use(jwt({ secret: contents, algorithms: ["RS256"] }));

app.get('/protected', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('Hello JWT');
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

