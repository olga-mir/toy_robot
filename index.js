'use strict'

const express = require('express')

const PORT = 8080
const HOST = '0.0.0.0'

let response = {
  myapplicaton: [{
    version: '1.0',
    lastcommitsha: 'abcdef01234567890',
    description: 'ciao come va'
  }]
}

const app = express();
app.get('/', (req, res) => {
  res.send(response)
});

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
