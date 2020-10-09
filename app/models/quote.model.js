const mongoose = require('mongoose');

const QuoteSchema = mongoose.Schema({
    quote: String,
    author: String,
    album: String,
})

module.exports = mongoose.model('Quote', QuoteSchema);