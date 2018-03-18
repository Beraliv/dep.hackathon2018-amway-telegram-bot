const express = require('express');
const packageInfo = require('./package.json');
const bodyParser = require('body-parser');
const { token, getBot } = require('./bot');

const app = express();

app.use(bodyParser.json());

const bot = getBot(app);

app.get('/', function(req, res) {
	res.json({ version: packageInfo.version });
});

const port = 8099;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.listen(port, function() {
	console.log('Web server started at localhost:%s', port);
});

module.exports = function() {
  app.post('/' + token, function(req, res) {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
