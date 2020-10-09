const Quote = require('../models/quote.model.js');
const cheerio = require('cheerio')
const fetch = require('node-fetch');

const url = 'https://www.myzitate.de/punchlines/'

exports.fetch = async (req, res) => {
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
        })
    })
};