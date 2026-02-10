/*
    TITLE : Link Status Checker
    DESCRIPTION : A Restful API to check the status of a link
    AUTHOR : Asif Karim
    DATE : 26 - 04 - 2025
    VERSION : 1.0
*/

const http = require('http');
const {handleRequest} = require('./Handler/RequestHandler');
const data = require('./lib/data');
const { sendTwilioSMS } = require('./helper/notifications')
const app = {};

app.config = {
    port : 3000
};

app.createServer = () => {
    const server = http.createServer(handleRequest);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`);
    });
};

app.createServer();