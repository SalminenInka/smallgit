const express = require('express')
const app = express()

app.get('/', function (req: any, res: { send: (arg0: string) => void; }) {
  res.send('Hello Git')
})
console.log('Other branch annihilated');

app.listen(6666);