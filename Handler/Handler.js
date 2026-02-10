const {hash, parseJSON, createRandomString} = require('../helper/utils');
const data = require('../lib/data');
const handlers = {};
const { maxChecks } = require('../helper/environment');

handlers.notFoundHandler = (requestParameter,callback) => {
    console.log("404 : Not Found");
    callback(404);
}

handlers.userHandler = (requestParameter,callback) => {
    const allowedMethods = ['get','post','put','delete'];
    if(allowedMethods.indexOf(requestParameter.method) >= 0){
        handlers._user[requestParameter.method](requestParameter,callback);
    }
    else{
        callback(405);
    }
}

handlers._user = {};

handlers._user.get = (requestParameter,callback)=>{
    const phoneNumber = (typeof(requestParameter.queryObject.phone) === 'string' && requestParameter.queryObject.phone.trim().length == 11) ? requestParameter.queryObject.phone : false;

    if(phoneNumber){

        const tokenId = (typeof(requestParameter.headerObject.token) === 'string' && requestParameter.headerObject.token.trim().length > 0) ? requestParameter.headerObject.token : false;
        if(tokenId){
            handlers._token.verify(tokenId,phoneNumber,(isValid) => {
                if(isValid){
                    data.read('users',phoneNumber,(err,user)=>{
                        if(!err && user){
                            const userObject = parseJSON(user);
                            delete userObject.password; 
                            callback(200,userObject);
                        }
                        else{
                            callback(500,{error: err});
                        }
                    })
                }
                else{
                    callback(403,{error: "Authentication Failed!!"});
                }
            })
        }
        else{
            callback(403,{error: "Authentication Failed!!"});
        }
    }
    else{
        callback(404,{error: "User Not Found!!"});
    }
    
}

handlers._user.post = (requestParameter,callback)=>{
    //console.log(requestParameter.body);
    //console.log(typeof(requestParameter.body.firstName));
    const firstName = (typeof(requestParameter.body.firstName) === 'string' && requestParameter.body.firstName.trim().length > 0) ?
                      requestParameter.body.firstName : false;
    const lastName = (typeof(requestParameter.body.lastName) === 'string' && requestParameter.body.lastName.trim().length > 0) ?
                      requestParameter.body.lastName : false;
    const phoneNumber = (typeof(requestParameter.body.phoneNumber) === 'string' && requestParameter.body.phoneNumber.trim().length == 11)?
                      requestParameter.body.phoneNumber : false;
    const password = (typeof(requestParameter.body.password) === 'string' && requestParameter.body.password.trim().length > 0)?
                      requestParameter.body.password : false;

    if(firstName && lastName && phoneNumber && password){
        const userObject = {
            firstName,
            lastName,
            phoneNumber,
            password: hash(password)
        };

        data.create('users',phoneNumber,userObject,(err)=>{
            if(!err){
                callback(200,{message: 'User Successfully Created!!'});
            }
            else{
                callback(500,{error: err});
            }
        })
    }
    else{
        callback(500,{error: "Required Data is missing!!"});
    }

}

handlers._user.put = (requestParameter,callback)=>{

    const firstName = (typeof(requestParameter.body.firstName) === 'string' && requestParameter.body.firstName.trim().length > 0) ?
                      requestParameter.body.firstName : false;
    const lastName = (typeof(requestParameter.body.lastName) === 'string' && requestParameter.body.lastName.trim().length > 0) ?
                      requestParameter.body.lastName : false;
    const phoneNumber = (typeof(requestParameter.body.phoneNumber) === 'string' && requestParameter.body.phoneNumber.trim().length == 11)?
                      requestParameter.body.phoneNumber : false;
    const password = (typeof(requestParameter.body.password) === 'string' && requestParameter.body.password.trim().length > 0)?
                      requestParameter.body.password : false;

    if(phoneNumber){

        const tokenId = (typeof(requestParameter.headerObject.token) === 'string' && requestParameter.headerObject.token.trim().length > 0) ? requestParameter.headerObject.token : false;

        handlers._token.verify(tokenId,phoneNumber,(isValid)=>{
            if(isValid){
                data.read('users',phoneNumber,(err,user)=>{
                    let userData = parseJSON(user);
                    if(!err){
                        if(firstName){
                            userData.firstName = firstName;
                        }
                        if(lastName){
                            userData.lastName = lastName;
                        }
                        if(password){
                            userData.password = hash(password);
                        }
                        data.update('users',phoneNumber,userData,(err1)=>{
                            if(!err1){
                                callback(200,{message: "Updated Successfully!!"});
                            }
                            else{
                                callback(500,{error: err1});
                            }
                        });
                    }
                    else{
                        callback(404,{error: "User not found!!"});
                    }
                });
            }
            else{
                callback(403,{error: "Authentication Failed!!"});
            }
        });
    } 
    else{
        callback(404,{error: "User not found!!"});
    }
}

handlers._user.delete = (requestParameter,callback)=>{
    const phoneNumber = (typeof(requestParameter.queryObject.phone) === 'string' && requestParameter.queryObject.phone.trim().length == 11) ? requestParameter.queryObject.phone : false;

    if(phoneNumber){
        const tokenId = (typeof(requestParameter.headerObject.token) === 'string' && requestParameter.headerObject.token.trim().length > 0) ? requestParameter.headerObject.token : false;

        handlers._token.verify(tokenId,phoneNumber,(isValid)=>{
            if(isValid){
                data.read('users',phoneNumber,(err,user)=>{
                    if(!err && user){
                        data.delete('users',phoneNumber,(err1)=>{
                            if(!err1){
                                callback(200,{message: "User Successfully Deleted!!"});
                            }
                            else callback(500,{error: err1});
                        })
                    }
                    else{
                        callback(500,{error: err});
                    }
                })
            }
            else{
                callback(403,{error: "Authentication Failed!!"});
            }
        });
    }
    else{
        callback(404,{error: "User Not Found!!"});
    }
}

handlers.tokenHandler = (requestParameter,callback) => {
    const allowedMethods = ['get','post','put','delete'];
    if(allowedMethods.indexOf(requestParameter.method) >= 0){
        handlers._token[requestParameter.method](requestParameter,callback);
    }
    else{
        callback(405);
    }
}

handlers._token = {};

handlers._token.get = (requestParameter,callback)=>{
    const tokenId = (typeof(requestParameter.queryObject.tokenId) === 'string' && requestParameter.queryObject.tokenId.trim().length > 0) ? requestParameter.queryObject.tokenId : false;

    if(tokenId){
        data.read('tokens',tokenId,(err,token)=>{
            if(!err && token){
                const tokenObject = parseJSON(token);                
                callback(200,tokenObject);
            }
            else{
                callback(500,{error: err});
            }
        })
    }
    else{
        callback(404,{error: "Token Not Found!!"});
    }
}

handlers._token.post = (requestParameter,callback)=>{

    const phoneNumber = (typeof(requestParameter.body.phoneNumber) === 'string' && requestParameter.body.phoneNumber.trim().length == 11)?
                      requestParameter.body.phoneNumber : false;
    const password = (typeof(requestParameter.body.password) === 'string' && requestParameter.body.password.trim().length > 0)?
                      requestParameter.body.password : false;

    if(phoneNumber && password){
        
        data.read('users',phoneNumber,(err,user)=>{
            if(!err){
                const userObject = parseJSON(user);
                if(userObject.password === hash(password)){
                    let tokenId = createRandomString(20);
                    let expires = Date.now() + 60 * 60 * 1000;
                    let tokenObject = {
                        phoneNumber,
                        id: tokenId,
                        expires
                    };

                    data.create('tokens',tokenId,tokenObject,(err1)=>{
                        if(!err1){
                            callback(200,tokenObject);
                        }
                        else{
                            callback(500, {error: err1});
                        }
                    })
                }
                else{
                    callback(400, {error: "Wrong Password!!"});
                }
            }
            else{
                callback(500,{error: err});
            }
        });
    }
    else{
        callback(400,{error: "Required Data is missing!!"});
    }
}

handlers._token.put = (requestParameter,callback)=>{
    const id = (typeof(requestParameter.body.id) === 'string' && requestParameter.body.id.trim().length > 0) ?
                      requestParameter.body.id : false;
    const extend = typeof(requestParameter.body.extend) === 'boolean'? 
                    requestParameter.body.extend : false;

    if(id && extend){
        data.read('tokens',id,(err,token)=>{
            if(!err && token){
                let tokenObject = parseJSON(token);
                if(tokenObject.expires < Date.now()){
                    callback(400, {error : "Token expired!!"});
                }
                else{
                    tokenObject.expires += 60 * 60 * 1000;
                    data.update('tokens',id,tokenObject,(err1)=>{
                        if(!err1){
                            callback(200,{message: "Updated Successfully!!"});
                        }
                        else{
                            callback(500,{error: err1});
                        }
                    })
                }
            }
            else{
                callback(404,{error: "Token not found!!"});
            }
        })
    } 
    else{
        callback(400,{error: "Invalid Request!!"});
    }
}

handlers._token.delete = (requestParameter,callback)=>{
    const id = (typeof(requestParameter.queryObject.id) === 'string' && requestParameter.queryObject.id.trim().length > 0) ? requestParameter.queryObject.id : false;

    if(id){
        data.read('tokens',id,(err,token)=>{
            if(!err && token){
                data.delete('tokens',id,(err1)=>{
                    if(!err1){
                        callback(200,{message: "Token Successfully Deleted!!"});
                    }
                    else callback(500,{error: err1});
                })
            }
            else{
                callback(500,{error: err});
            }
        })
    }
    else{
        callback(404,{error: "Token Not Found!!"});
    }
}

//Token Verifier Function. True if token is ok, false otherwise.
handlers._token.verify = (id,phoneNumber,callback)=>{
    id = (typeof(id) === 'string' && id.trim().length > 0) ? id : false;
    phoneNumber = (typeof(phoneNumber) === 'string' && phoneNumber.trim().length == 11) ? 
                   phoneNumber : false;
    if(id && phoneNumber){
        data.read('tokens',id,(err,tokenData)=>{
            if(!err && tokenData){
                const tokenObject = parseJSON(tokenData);
                if(phoneNumber === tokenObject.phoneNumber && tokenObject.expires > Date.now()){
                    callback(true);
                }
                else callback(false);
            }
            else{
                callback(false);
            }
        });
    } 
    else{
        callback(false);
    }
}

handlers.checkHandler = (requestParameter,callback) => {
    const allowedMethods = ['get','post','put','delete'];
    if(allowedMethods.indexOf(requestParameter.method) >= 0){
        handlers._check[requestParameter.method](requestParameter,callback);
    }
    else{
        callback(405);
    }
}

handlers._check = {};

handlers._check.get = (requestParameter,callback)=>{
    const id = (typeof(requestParameter.queryObject.id) === 'string' && requestParameter.queryObject.id.trim().length > 0) ? requestParameter.queryObject.id : false;

    if(id){
        data.read('checks',id,(err,checkData)=>{
            if(!err && checkData){
                const checkObject = parseJSON(checkData);
                const tokenId = (typeof(requestParameter.headerObject.token) === 'string' && requestParameter.headerObject.token.trim().length > 0) ? requestParameter.headerObject.token : false;
                if(tokenId){
                    handlers._token.verify(tokenId,checkObject.userPhone,(isValid) => {
                        if(isValid){
                            callback(200,checkObject);
                        }
                        else{
                            callback(403,{error: "Authentication Failed!!"});
                        }
                    })
                }
                else{
                    callback(403,{error: "Authentication Failed!!"});
                }
            }
            else{
                callback(500,{error: err});
            }
        })
    }
    else{
        callback(400,{error: "Required Data Missing!!"});
    }    
}

handlers._check.post = (requestParameter,callback)=>{

    const allowedProtocols = ['http','https'];
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];

    const protocol = (typeof(requestParameter.body.protocol) === 'string' && allowedProtocols.indexOf(requestParameter.body.protocol) >= 0) ?
                      requestParameter.body.protocol : false;
    const url = (typeof(requestParameter.body.url) === 'string' && requestParameter.body.url.trim().length > 0) ?
                      requestParameter.body.url : false;
    const method = (typeof(requestParameter.body.method) === 'string' && allowedMethods.indexOf(requestParameter.body.method) >= 0) ?
                      requestParameter.body.method : false;
    const successCodes = (typeof(requestParameter.body.successCodes) === 'object' && requestParameter.body.successCodes instanceof Array)?
                      requestParameter.body.successCodes : false;
    const timeout = (typeof(requestParameter.body.timeout) === 'number' &&  requestParameter.body.timeout % 1 === 0 && 
                    requestParameter.body.timeout >= 1 && requestParameter.body.timeout <= 5) ?  requestParameter.body.timeout : false;
    

    if(protocol && url && method && successCodes && timeout){
        const tokenId = typeof(requestParameter.headerObject.token) === 'string' && requestParameter.headerObject.token.trim().length > 0 ?
                        requestParameter.headerObject.token : false;
        if(tokenId){
            data.read('tokens',tokenId,(err,tokenData)=>{
                if(!err && tokenData){
                    let userPhone = parseJSON(tokenData).phoneNumber;
                    data.read('users',userPhone,(err1,userData)=>{
                        if(!err1 && userData){
                            handlers._token.verify(tokenId,userPhone,(isValid)=>{
                                if(isValid){
                                    const userObject = parseJSON(userData);
                                    const userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ?
                                                        userObject.checks : [];
                                    if(userChecks.length < 5){
                                        const checkId = createRandomString(20);
                                        const checkObject = {
                                            id: checkId,
                                            userPhone,
                                            protocol,
                                            url,
                                            method,
                                            successCodes,
                                            timeout
                                        }
                                        data.create('checks',checkId,checkObject,(err3)=>{
                                            if(!err3){
                                                userChecks.push(checkId);
                                                userObject.checks = userChecks;
                                                data.update('users',userPhone,userObject,(err4)=>{
                                                    if(!err4){
                                                        callback(200,checkObject);
                                                    }
                                                    else{
                                                        callback(500,{error: "Server Side Error!!"});
                                                    }
                                                })
                                            }
                                            else{
                                                callback(500,{error: "Server Side Error!!"});
                                            }
                                        });
                                    }
                                    else{
                                        callback(401, {error: "Max Check Limit Reached!!"});
                                    }
                                }
                                else{
                                    callback(403,{error: "Authentication Failed!!"});                  
                                }
                            })
                        }
                        else{
                            callback(404,{error : "User Not Found!!"});
                        }
                    })
                }
                else{
                    callback(403,{error: "Authentication Failed!!"});
                }
            })
        }
        else{
            callback(403,{error: "Authentication Failed!!"});
        }
    }
    else{
        callback(400,{error: "Required Data is missing!!"});
    }

}

handlers._check.put = (requestParameter,callback)=>{

    const allowedProtocols = ['http','https'];
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];

    const protocol = (typeof(requestParameter.body.protocol) === 'string' && allowedProtocols.indexOf(requestParameter.body.protocol) >= 0) ?
                      requestParameter.body.protocol : false;
    const url = (typeof(requestParameter.body.url) === 'string' && requestParameter.body.url.trim().length > 0) ?
                      requestParameter.body.url : false;
    const method = (typeof(requestParameter.body.method) === 'string' && allowedMethods.indexOf(requestParameter.body.method) >= 0) ?
                      requestParameter.body.method : false;
    const successCodes = (typeof(requestParameter.body.successCodes) === 'object' && requestParameter.body.successCodes instanceof Array)?
                      requestParameter.body.successCodes : false;
    const timeout = (typeof(requestParameter.body.timeout) === 'number' &&  requestParameter.body.timeout % 1 === 0 && 
                    requestParameter.body.timeout >= 1 && requestParameter.body.timeout <= 5) ?  requestParameter.body.timeout : false;
    const id = (typeof(requestParameter.body.id) === 'string' && requestParameter.body.id.trim().length > 0) ? requestParameter.body.id : false;

    if(id){
        data.read('checks',id,(err,checkData)=>{
            if(!err && checkData){
                const checkObject = parseJSON(checkData);
                const tokenId = (typeof(requestParameter.headerObject.token) === 'string' && requestParameter.headerObject.token.trim().length > 0) ? requestParameter.headerObject.token : false;
                if(tokenId){
                    handlers._token.verify(tokenId,checkObject.userPhone,(isValid) => {
                        if(isValid){

                            if(protocol) checkObject.protocol = protocol;
                            if(url) checkObject.url = url;
                            if(method) checkObject.method = method;
                            if(successCodes) checkObject.successCodes = successCodes;
                            if(timeout) checkObject.timeout = timeout;

                            data.update('checks',id,checkObject,(err1)=>{
                                if(!err1){
                                    callback(200,checkObject);
                                }
                                else{
                                    callback(500,{error: err1});
                                }
                            })
                        }
                        else{
                            callback(403,{error: "Authentication Failed!!"});
                        }
                    })
                }
                else{
                    callback(403,{error: "Authentication Failed!!"});
                }
            }
            else{
                callback(500,{error: err});
            }
        })
    }
    else{
        callback(400,{error: "Required Data Missing!!"});
    } 

}

handlers._check.delete = (requestParameter,callback)=>{
    const id = (typeof(requestParameter.queryObject.id) === 'string' && requestParameter.queryObject.id.trim().length > 0) ? requestParameter.queryObject.id : false;

    if(id){
        data.read('checks',id,(err,checkData)=>{
            if(!err && checkData){
                const checkObject = parseJSON(checkData);
                const tokenId = (typeof(requestParameter.headerObject.token) === 'string' && requestParameter.headerObject.token.trim().length > 0) ? requestParameter.headerObject.token : false;
                if(tokenId){
                    handlers._token.verify(tokenId,checkObject.userPhone,(isValid) => {
                        if(isValid){
                            data.delete('checks',id,(err1)=>{
                                if(!err1){
                                    data.read('users',checkObject.userPhone,(err2,userData)=>{
                                        if(!err2 && userData){
                                            const userObject = parseJSON(userData);
                                            const userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array ?
                                                                userObject.checks : [];
                                            let position = userChecks.indexOf(id);
                                            if(position >= 0){
                                                userChecks.splice(position,1);
                                                userObject.checks = userChecks;
                                                data.update('users',checkObject.userPhone,userObject,(err3)=>{
                                                    if(!err3){
                                                        callback(200,{message: "Successfully Deleted!!"});
                                                    }
                                                    else{
                                                        callback(500,{error: err3});
                                                    }
                                                })
                                            }
                                            else{
                                                callback(500,{error: "Check not found properly!!"});
                                            }
                                        }
                                        else{
                                            callback(500,{error: err2});
                                        }
                                    })
                                }
                                else{
                                    callback(500,{error: err1});
                                }
                            })
                        }
                        else{
                            callback(403,{error: "Authentication Failed!!"});
                        }
                    })
                }
                else{
                    callback(403,{error: "Authentication Failed!!"});
                }
            }
            else{
                callback(500,{error: err});
            }
        })
    }
    else{
        callback(400,{error: "Required Data Missing!!"});
    } 
}

module.exports = handlers;