require('dotenv').config();
const connect = require('./database/config');
const Server = require('./models/server');
connect().then(() => new Server().listen()).catch(error => { console.error(error.message); process.exitCode = 1; });
