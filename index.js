const express = require('express')
const app = express()

const hostname = '127.0.0.1';
const port = 8000;
// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
  }

app.use(myLogger);

app.get('/', (req, res) => {
  res.send({result: 'Hello, World'});
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});