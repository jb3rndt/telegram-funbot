const quotes = require('./quote.controller.js');
const fetch = require('node-fetch');
const config = require('../../config.js');

exports.update = async (req, res) => {
    const payload = req.body;
    const message = payload.result.message;
    if(message.text.endsWith("$line")) {
        const quote = await quotes.getRandomQuote();
        await fetch(encodeURI(`https://api.telegram.org/bot${config.bottoken}/sendmessage?chat_id=${message.chat.id}&text="${quote.quote}"\n ~ ${quote.author} (${quote.song})\nAlbum: ${quote.album}`));
        res.status(200).send({
            message: 'Sent line, have fun with it',
        });
    } else if(message.text.endsWith("$ir")) {
        const text = message.text.replace('$ir', '');
        let result = '';
        const words = text.split(' ');
        words.forEach(word => {
            const letters = word.split('');
            letters.forEach((letter, i) => {
                if(i % 2) {
                    result += letter.toString().toUpperCase();
                } else {
                    result += letter.toString().toLowerCase();
                }
            });
            result += ' ';
        });
        res.status(200).send({
            message: result,
        });
    } else {
        res.status(200).send({
            message: 'Nothing happened',
        });
    }
};