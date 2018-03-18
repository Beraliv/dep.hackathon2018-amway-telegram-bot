const express = require('express');
const packageInfo = require('./package.json');
const bodyParser = require('body-parser');
const { token, getBot } = require('./bot');

const app = express();
const bot = getBot(app);

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.json({ version: packageInfo.version });
});

const server = app.listen(process.env.PORT, '0.0.0.0', function() {
	const host = server.address().address;
	const port = server.address().port;
	console.log('Web server started at http://%s:%s', host, port);
});

module.exports = function() {
  app.post('/' + token, function(req, res) {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
