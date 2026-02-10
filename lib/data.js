const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname,'/../.data');

lib.create = (dir,file,data,callback)=>{
    const filePath = lib.basedir + '/' + dir + '/' + file + '.json';
    fs.open(filePath,'wx', (err,fileDescriptor)=>{
        if((!err) && fileDescriptor){
            fs.writeFile(fileDescriptor,JSON.stringify(data),(err2)=>{
                if(!err2){
                    fs.close(fileDescriptor,(err3)=>{
                        if(!err3){
                            callback(false);
                        }
                        else{
                            callback('Error in closing new file!!');
                        }
                    })
                }
                else{
                    callback('Error writing in new file!!');
                }
            })
        }
        else{
            callback('Error in opening new file! May already exist!!');
        }
    });
}

lib.read = (dir,file,callback)=>{
    const filePath = lib.basedir + '/' + dir + '/' + file + '.json';
    fs.readFile(filePath,'utf-8',(err,data)=>{
        callback(err, data);
    });
}

lib.update = (dir,file,data,callback)=>{
    const filePath = lib.basedir + '/' + dir + '/' + file + '.json';
    fs.open(filePath,'r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            const Data = JSON.stringify(data);
            fs.ftruncate(fileDescriptor,(err2) => {
                if(!err2){
                    fs.writeFile(fileDescriptor,Data,(err3)=>{
                        if(!err3){
                            fs.close(fileDescriptor,(err4)=>{
                                if(!err4){
                                    callback(false);
                                }
                                else{
                                    callback("Error in file closing while updating!!");
                                }
                            })
                        }
                        else{
                            callback("Error in file writing while updating!!");
                        }
                    })
                }
                else{
                    callback("Error in file truncating while updating!!");
                }
            })
        }
        else{ 
            callback("Error in File Opening while Updating!!");
        }
    })
}

lib.delete = (dir,file,callback)=>{
    const filePath = lib.basedir + '/' + dir + '/' + file + '.json';
    fs.unlink(filePath,(err)=>{
        if(!err){
            callback(false);
        }
        else{
            callback("Error deleting file!!");
        }
    })
}

module.exports = lib;