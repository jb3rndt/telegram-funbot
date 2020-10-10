const config = require('../config.js');
const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString: config.db_url,
});
exports.pool = pool;

const createTableText = `
    CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL,
        quote TEXT,
        author VARCHAR(1000),
        song VARCHAR(1000),
        album VARCHAR(1000)
    );
`

exports.init = () => {
    pool.query(createTableText).then(() => {
        console.log('Schema successfully created');
    }).catch((err) => {
        console.log('Something went wrong when creating the Schema.');
        console.log(err);
    });
};

exports.reset = async () => {
    await pool.query('DROP TABLE quotes;');
    this.init();
};