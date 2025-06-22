const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbconfig = require('./config/dbconfig');

const server = require('./app');

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log('Listening to requests on PORT: ' + port);
});