module.exports = (app) => {
    const quotes = require('../controllers/quote.controller.js');
    const funbot = require('../controllers/funbot.controller.js');
    const config = require('../../config.js');

    // Fetch all Quotes from https://www.myzitate.de/punchlines/
    app.get('/fetchquotes', quotes.fetch);

    // Trigger a bot update to check for messages (webhook)
    app.post(`/update/${config.bottoken}`, funbot.update);
}