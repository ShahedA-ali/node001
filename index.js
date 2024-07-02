const express = require('express')
require('dotenv').config({ path: `.env.local` })
var cors = require('cors')
const db = require('./db')
const app = express()

const hostname = '127.0.0.1';
const port = 8000;


const userRouter = require('./routes/userRoutes')
const roleRouter = require('./routes/roleRoutes')

// Add Access Control Allow Origin headers
app.use(cors());
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
app.use('/api/roles', roleRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});