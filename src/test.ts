const express = require('express')
const app = express()

app.get('/', function (req: any, res: { send: (arg0: string) => void; }) {
  res.send('Hello Git')
})
console.log('merge me, daddy!');
app.listen(6666);