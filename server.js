const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const config = require('./config.js');

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: config.db_url,
});
module.exports = pool;
const createTableText = `
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL,
    quote TEXT,
    author VARCHAR(1000),
    song VARCHAR(1000),
    album VARCHAR(1000)
);
`
pool.query(createTableText).then(() => {
    console.log('Schema successfully created');
}).catch((err) => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.json({'message': 'Welcome to the funny Telegram Bot API'});
});

require('./app/routes/funbot.routes.js')(app);

app.listen(config.port, () => {
    console.log('Server is listening on port ' + config.port);
})