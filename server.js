const express = require('express');
const bodyParser = require('body-parser');
const db = require('./app/db.js');
const config = require('./config.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())


db.init();

app.get('/', (req, res) => {
    res.json({'message': 'Welcome to the funny Telegram Bot API'});
});

require('./app/routes/funbot.routes.js')(app);

app.listen(config.port, () => {
    console.log('Server is listening on port ' + config.port);
})