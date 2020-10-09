module.exports = {
    db_url: process.env.DATABASE_URL || 'mongodb://localhost:27017/',
    bottoken: process.env.bottoken,
    port: process.env.PORT || 3000,
}