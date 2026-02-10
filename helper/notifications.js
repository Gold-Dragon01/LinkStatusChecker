const https = require('https');
const { twilio } = require('./environment');
const querystring = require('querystring');

const notification = {};

notification.sendTwilioSMS = (phoneNumber,message,callback)=>{

    const userPhone = (typeof(phoneNumber) === 'string' && phoneNumber.trim().length === 11) ? phoneNumber.trim() : false;
    const userMsg = (typeof(message) === 'string' && message.trim().length > 0 && message.trim().length <= 1600) ? message.trim() : false;
    
    if(userPhone && userMsg){

        const payload = {
            From: twilio.fromPhone, 
            To: `+88${userPhone}`,
            Body: userMsg
        }
        const payloadString = querystring.stringify(payload);
        const requestOptions = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.apiKeySid}:${twilio.apiKeySecret}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(payloadString)
            }
        }
        const req = https.request(requestOptions,(res)=>{
            if(res.statusCode === 200 || res.statusCode === 201){
                callback(false);
            }
            else{
                callback(`Status Code was ${res.statusCode}`);
            }
        })

        req.on('error', (err)=>{
            callback(err);
        })

        req.write(payloadString);
        req.end();
    }
    else{
        callback(400, {error: "Required Data Missing!!"});
    }
}

module.exports = notification;