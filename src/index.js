require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express'); // Express web server framework
const mongoose = require('mongoose');
const morgan = require('morgan');
// const request = require('request'); // "Request" library
const cors = require('cors');
const routes = require('./routes/index.js');
const app = express();
const router = express.Router();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', routes);
app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/images', express.static(__dirname + '/public/images'));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Server started on ${process.env.PORT}`);
});

module.exports = app;