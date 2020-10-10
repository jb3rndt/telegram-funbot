const cheerio = require('cheerio')
const fetch = require('node-fetch');
const db = require('../db.js');

const url = 'https://www.myzitate.de/punchlines/'

exports.fetch = async (req, res) => {
    try {
        await db.reset();
    } catch(err) {
        return res.status(500).send({
            message: 'Something went wrong while resetting the database! ' + err.message,
        });
    }
    console.log('Database reset successful.');
    for(let i = 1; i < 8; i++) {
        let $;
        try {
            const response = await fetch(`${url}i/`);
            const html = await response.text();
            $ = cheerio.load(html);
        } catch(err) {
            return res.status(500).send({
                message: 'Something went wrong while fetching the data! ' + err.message,
            });
        }

        $('div[zitatid]').each((i, elem) => {
            const quote = $(elem).find('p').text();
            const author = $(elem).find('a[href]').text();
            const song = $(elem).find('em').text();
            const album = $(elem).find('.full').text().split('Album: ')[1];
            db.pool.query('INSERT INTO quotes(quote, author, song, album) VALUES ($1, $2, $3, $4)', [quote, author, song, album]).then(data => {
                console.log('Successfully saved ' + data + '\nin the database');
            }).catch(err => {
                res.status(500).send({
                    message: 'Some error occured while parsing and saving the quotes. ' + err.message,
                });
            });
        });
    }
    res.status(200).send({
        message: 'Everything worked as expected and got saved into the database. Here is the proof: ',
        quote: await this.getRandomQuote().catch((err) => err.message),
    });
};

exports.getRandomQuote = async () => {
    const count = await (await db.pool.query('SELECT count(*) FROM quotes')).rows[0].count;
    console.log(count);
    const random = Math.floor(Math.random() * count);
    const quote = await (await db.pool.query('SELECT * FROM quotes')).rows[random];
    return quote;
}
