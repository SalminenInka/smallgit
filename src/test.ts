const express = require('express')
const app = express()

app.get('/', function (req: any, res: { send: (arg0: string) => void; }) {
  res.send('Hello Git')
})

app.listen(6666);