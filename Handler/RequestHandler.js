const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../route');
const { notFoundHandler } = require('./Handler');
const {parseJSON} = require('../helper/utils');
const ReqHandler = {};
// need to write logic for choosing handler

ReqHandler.handleRequest = (req, res) => {
    const parsedUrl = url.parse(req.url,true);
    //console.log(parsedUrl);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    //console.log(trimmedPath);
    const method = req.method.toLowerCase();
    const queryObject = parsedUrl.query;
    const headerObject = req.headers;

    const requestParameter = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryObject,
        headerObject
    }
    //console.log(requestParameter);
//    console.log(routes);
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    const decoder = new StringDecoder('utf-8');
    let Data = '';
    req.on('data',(buffer) =>{
        Data += decoder.write(buffer);
    })
    req.on('end',()=>{
        Data += decoder.end();

        requestParameter.body = parseJSON(Data);

        chosenHandler(requestParameter,(statusCode,payload)=>{
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadData = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadData);
        });

        //console.log(Data);
    })
}

module.exports = ReqHandler;