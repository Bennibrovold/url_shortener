const mongoose = require('mongoose');

const db = (settings) => {

    mongoose.connect("mongodb://localhost/linkshorter",{
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    
    database = mongoose.connection;
    database.once('open', () => console.log('db is working'));
    database.on('error', console.error.bind(console, 'db error'));
    return db;
}

module.exports = db;