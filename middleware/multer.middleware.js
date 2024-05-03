const multer = require('multer');
const path = require('path')

const fs = require('fs')

if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

const upload = multer({
    limits: {fileSize: 50 * 1024*1024} , // 50 mb in size max limit
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req,file,cb) =>{
            cb(null , file.originalname);
        },
    }),
    fileFilter: (req , file , cb)=>{
        let ext = path.extname(file.originalname);

        if(
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".png" 
        ){
           return cb(new Error(`Unsupported file type! ${ext}`) , false);
            
        }

        cb(null , true);
    }
})

module.exports = upload