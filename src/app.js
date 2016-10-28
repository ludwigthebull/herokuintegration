const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot');

const app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res, next) {
  const postData = { input: req.body.input };

  if (req.body.clientName) {
    postData.client_name = req.body.clientName;
    bot.talk(postData, botResponseHandler);
  } else {
    bot.atalk(postData, botResponseHandler);
  }

  function botResponseHandler(err, botResponse) {
    if (err) {
      return next(err);
    }
    const resp = { text: botResponse.responses.join(' ') };
    if (botResponse.client_name) {
      resp.clientName = botResponse.client_name;
    }
    res.send(resp);
  }
});

app.post('/place', function(req, res, next) {
  var search = req.body.search;

  var googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_PLACES_API_KEY
  });

  googleMapsClient.places({query: search}, function(err, response) {
    if (response.json.status === 'ZERO_RESULTS') {
      res.status(400).json({error: 'Place could not be found.'});
    }

    var place = {
      id: response.json.results[0].place_id,
      name: response.json.results[0].name,
      address: response.json.results[0].formatted_address,
      icon: response.json.results[0].icon
    };

    res.send(place);
  });
});

app.post('/relay', function(req, res, next) {
  setTimeout(function() {
    res.send({text: req.body.input, clientName: "fake-client"});
  }.bind(this), 1000);
});

module.exports = app;
