'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet")
const cors = require('cors');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const ninetyDaysInSeconds = 90 * 24 * 60 * 60

const app = express();
app.use(helmet.hidePoweredBy())
app.use(helmet.frameguard({ action: 'deny' }))
app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(helmet.ieNoOpen())
app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds, force: true }))
app.use(helmet.dnsPrefetchControl())
app.use(helmet.noCache())
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'"],
    styleSrc: ["'self"]
  }
}))

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT || 3000);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
