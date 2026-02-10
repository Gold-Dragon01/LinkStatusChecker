const crypto = require('crypto');
const environment = require('./environment');
const utils = {};

utils.parseJSON = (str)=>{
    let result;
    try{
        result = JSON.parse(str);
    } catch{
        result = {};
    }
    return result;
}

utils.hash = (str)=>{
    if(typeof str === 'string' && str.length > 0){
        return crypto.createHmac('sha256',environment['secretKey']).update(str).digest('hex');
    }
    else return false;
}

utils.createRandomString = (strLength)=>{
    strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;

    if(strLength){
        const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let ans = "";

        for(let i = 1;i<=strLength;i++){
            let index = Math.floor(Math.random() * possibleCharacters.length);
            let chosenChar = possibleCharacters.charAt(index);

            ans += chosenChar;
        }
        return ans;
    }
    return false;
}

module.exports = utils;