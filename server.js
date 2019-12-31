const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser'); // middleware to parse body
const { initMongo } = require('./server/MongoDB');

const app = express();
const port = process.env.PORT || 5000;
var db;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize connection once
initMongo((dbObj) => {
  if (!dbObj) {
    return false;
  }
  db = dbObj;
  app.listen(port, () => {
    console.log('Server is running at port:', port);
  });
});

app.post('/api/add-note', (req, res) => {
  if (!req.body.note) {
    return res.send({
      error: true,
      message: 'Please enter something.'
    })
  }
  db.collection('Notes').insertOne({
    value: req.body.note
  }, (err, result) => {
    if (err) {
      return res.send({
        error: true,
        message: err
      })
    }
    return res.send({
      error: false,
      message: 'Record has been added successfully.'
    })
  })
});

app.get('/api/notes', (req, res) => {
  db.collection('Notes').find({}).toArray((err, result) => {
    if (err) {
      return res.send({
        error: true,
        message: err
      })
    }
    return res.send({
      error: false,
      message: 'Record has been fetched successfully.',
      data: result
    })
  })
});




