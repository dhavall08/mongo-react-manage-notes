const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser'); // middleware to parse body
const { initMongo, ObjectId } = require('./server/MongoDB');

const app = express();
const port = process.env.PORT || 5000;
var db;
var allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
var corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(bodyParser.json()); // can set limit; default to 100kb
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize connection once
initMongo // also can be done using callback function
  .then((dbObj) => {
    if (!dbObj) {
      return false;
    }
    db = dbObj;
    app.listen(port, () => {
      console.log('Server is running at port:', port);
    });
  })
  .catch(error =>
    console.log(error));

app.post('/api/add-note', (req, res) => {
  if (!req.body.note) {
    return res.send({
      error: true,
      message: 'Please enter something to add.'
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

app.delete('/api/delete-note', (req, res) => {
  if (!req.body.id) {
    return res.send({
      error: true,
      message: 'Please select id.'
    })
  }

  // return promise if callback is not passed
  db.collection('Notes').deleteOne({ _id: new ObjectId(req.body.id) })
    .then(result => {
      res.send({
        error: false,
        message: 'Record has been deleted successfully.',
        data: result
      })
    })
    .catch(error => {
      res.send({
        error: true,
        message: error
      })
    })
});




