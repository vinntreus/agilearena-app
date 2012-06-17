var mongo = require('mongoskin'),
    db = mongo.db('localhost:27017/agilearena?auto_reconnect');    

module.exports = db;