const express = require('express')
const db = require('./db')
const app = express()

const hostname = '127.0.0.1';
const port = 8000;


const userRouter = require('./routes/userRoutes')

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

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({extended: true, limit: '10kb'}))

app.get('/', (req, res) => {
  res.send({result: 'Hello, World'});
});

app.use('/api/users', userRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});