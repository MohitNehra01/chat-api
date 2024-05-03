const mongoose = require('mongoose');

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chatApplication"

const dbConnect = async ()=>{
    try {
         
        const {connection} = await mongoose.connect(DB_URI)
        
        if(connection){
            console.log(`connected to MongoDb: host = ${connection.host} , port = ${connection.port} name = ${connection.name}`)
        }
    } catch (error) {
        console.log('error in connection of data base' , error);
        process.exit(1)
    }
}

module.exports = dbConnect