const express = require('express');
const cors = require('cors')({ origin: true });
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const mongoose = require('mongoose');

const config = require('./config/index.js');
const Betsapi = require('./controller/betsapi.js');

//mongoose.connect(config.DBCONNECT, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
mongoose.connect(config.TESTDATADB, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
  console.log('Betsapi Database is connected');

  app.use(cors);
  app.options('*', cors);

  Betsapi()

  server.listen(config.betsapi, () => {
    console.log(`Started server on => http://localhost:${config.betsapi}`);
  });

}, err => { console.log('Can not connect to the betsapi database' + err) });