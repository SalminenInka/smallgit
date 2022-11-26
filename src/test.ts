const express = require('express')
const app = express()

app.get('/', function (req: any, res: { send: (arg0: string) => void; }) {
  res.send('Hello Git')
})
console.log('Trying out the branch merge');
console.log('Merge me, daddy!');

app.listen(6666);