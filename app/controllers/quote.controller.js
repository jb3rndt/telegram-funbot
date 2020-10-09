const Quote = require('../models/quote.model.js');
const cheerio = require('cheerio')
const fetch = require('node-fetch');

const url = 'https://www.myzitate.de/punchlines/'

exports.fetch = async (req, res) => {

    await Quote.remove().catch(err => {
        return res.status(500).send({
            message: 'Something went wrong while resetting the database! ' + err.message,
        })
    });
    console.log('Database reset successful.');
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const quotes = []
    $('div[zitatid]').each((i, elem) => {
        const quote = $(elem).find('p').text();
        const author = $(elem).find('a[href]').text();
        const title = $(elem).find('em').text();
        const album = $(elem).find('.full').text().split('Album: ')[1];
        const quoteObject = new Quote({
            quote: quote,
            author: author,
            title: title,
            album: album,
        });
        quoteObject.save().then(data => {
            console.log('Successfully saved ' + data + '\nin the database');
        }).catch(err => {
            res.status(500).send({
                message: err.message || ' Some error occured while fetching the quotes',
            });
        });
    });
    res.send({
        message: 'Everything worked as expected and got saved into the Database. Here is the proof: ',
        quote: await this.getRandomQuote(),
    });
};

exports.getRandomQuote = async () => {
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);

    const quote = await Quote.findOne().skip(random);
    return quote;
}
